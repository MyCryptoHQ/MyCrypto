import BN from 'bn.js';
import { SagaIterator } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';
import { bufferToHex, toBuffer } from 'ethereumjs-util';

import { encodeTransfer } from 'libs/transaction';
import { Address, Wei } from 'libs/units';
import configuredStore from 'features/store';
import * as derivedSelectors from 'features/selectors';
import * as configSelectors from 'features/config/selectors';
import { scheduleActions } from 'features/schedule';
import { transactionFieldsActions, transactionFieldsSelectors } from '../fields';
import * as transactionActions from '../actions';
import * as transactionSelectors from '../selectors';
import * as transactionHelpers from '../helpers';
import * as selectors from './selectors';
import * as sagas from './sagas';

describe('Meta Sagas', () => {
  describe('Token', () => {
    configuredStore.getState();

    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('handleTokenTo*', () => {
      const action: any = {
        payload: {
          value: 'value1'
        }
      };
      const tokenValue: any = {
        value: 'value2'
      };
      const data: any = 'data';

      const gens: any = {};
      gens.gen = cloneableGenerator(sagas.handleTokenTo)(action);

      it('should select getTokenValue', () => {
        expect(gens.gen.next().value).toEqual(select(selectors.getTokenValue));
      });

      it('should return if !tokenValue.value', () => {
        gens.clone1 = gens.gen.clone();
        expect(gens.clone1.next({ value: false }).done).toEqual(true);
      });

      it('should call encodeTransfer', () => {
        expect(gens.gen.next(tokenValue).value).toEqual(
          call(encodeTransfer, action.payload.value, tokenValue.value)
        );
      });

      it('should put setDataField', () => {
        expect(gens.gen.next(data).value).toEqual(
          put(
            transactionFieldsActions.setDataField({
              raw: bufferToHex(data),
              value: data
            })
          )
        );
      });

      itShouldBeDone(gens.gen);
    });

    describe('handleTokenValue*', () => {
      const action: any = {
        payload: {
          value: 'value1'
        }
      };
      const tokenTo: any = {
        value: 'value2'
      };
      const data: any = toBuffer('0x0a');
      const prevData: any = {
        raw: '0x0b'
      };

      const gens: any = {};
      gens.gen = cloneableGenerator(sagas.handleTokenValue)(action);

      it('should select getTokenTo', () => {
        expect(gens.gen.next().value).toEqual(select(selectors.getTokenTo));
      });

      it('should select getData', () => {
        gens.clone1 = gens.gen.clone();
        expect(gens.gen.next(tokenTo).value).toEqual(select(transactionFieldsSelectors.getData));
      });

      it('should return if !tokenTo.value', () => {
        gens.clone1.next({ value: false });
        expect(gens.clone1.next().done).toEqual(true);
      });

      it('should call encodeTransfer', () => {
        expect(gens.gen.next(prevData).value).toEqual(
          call(encodeTransfer, tokenTo.value, action.payload.value)
        );
      });

      it('should put setDataField', () => {
        gens.clone2 = gens.gen.clone();
        expect(gens.gen.next(data).value).toEqual(
          put(transactionFieldsActions.setDataField({ raw: bufferToHex(data), value: data }))
        );
      });

      it('should return if prevData is equal to data', () => {
        const sameData = toBuffer('0xb');
        expect(gens.clone2.next(sameData).done).toEqual(true);
      });

      itShouldBeDone(gens.gen);
    });
  });

  describe('Unit Swap', () => {
    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('handleSetUnitMeta*', () => {
      const expectedStart = (
        gen: SagaIterator,
        previousUnit: string,
        currentUnit: string,
        prevUnitIsNetworkUnit: boolean,
        currUnitIsNetworkUnit: boolean
      ) => {
        it('should select getPreviousUnit', () => {
          expect(gen.next().value).toEqual(select(transactionSelectors.getPreviousUnit));
        });

        it('should check if prevUnit is a network unit', () => {
          expect(gen.next(previousUnit).value).toEqual(
            select(configSelectors.isNetworkUnit, previousUnit)
          );
        });

        it('should check if currUnit is a network unit', () => {
          expect(gen.next(prevUnitIsNetworkUnit).value).toEqual(
            select(configSelectors.isNetworkUnit, currentUnit)
          );
        });

        it('should select getDeciimalFromUnit with currentUnit', () => {
          expect(gen.next(currUnitIsNetworkUnit).value).toEqual(
            select(derivedSelectors.getDecimalFromUnit, currentUnit)
          );
        });
      };

      describe('etherToEther', () => {
        const currentUnit = 'ETH';
        const previousUnit = 'ETH';
        const action: any = {
          payload: currentUnit
        };
        const gen = sagas.handleSetUnitMeta(action);

        expectedStart(gen, previousUnit, currentUnit, true, true);

        it('should return correctly', () => {
          expect(gen.next().value).toEqual(undefined);
        });

        itShouldBeDone(gen);
      });

      describe('tokenToEther', () => {
        const previousUnit = 'token';
        const currentUnit = 'ETH';
        const action: any = {
          payload: currentUnit
        };
        const decimal = 1;
        const tokenTo: any = 'tokenTo';
        const tokenValue: any = 'tokenValue';
        const raw = 'raw';
        const value: any = 'value';
        const gen = sagas.handleSetUnitMeta(action);

        expectedStart(gen, previousUnit, currentUnit, false, true);

        it('should select getTokenTo', () => {
          expect(gen.next(decimal).value).toEqual(select(selectors.getTokenTo));
        });

        it('should select getTokenValue', () => {
          expect(gen.next(tokenTo).value).toEqual(select(selectors.getTokenValue));
        });

        it('should call rebaseUserInput with tokenValue', () => {
          expect(gen.next(tokenValue).value).toEqual(
            call(transactionHelpers.rebaseUserInput, tokenValue)
          );
        });

        it('should call validateInput with value and currentUnit', () => {
          expect(gen.next({ value, raw }).value).toEqual(
            call(transactionHelpers.validateInput, value, currentUnit)
          );
        });

        it('should put swapTokenToEther', () => {
          expect(gen.next(true).value).toEqual(
            put(
              transactionActions.swapTokenToEther({
                to: tokenTo,
                value: {
                  raw,
                  value
                },
                decimal
              } as any)
            )
          );
        });

        itShouldBeDone(gen);
      });

      describe('etherToToken || tokenToToken', () => {
        const sharedLogicA = (gen: SagaIteratorClone, decimal: number, currentUnit: string) => {
          it('should select getToken with currentUnit', () => {
            expect(gen.next(decimal).value).toEqual(select(derivedSelectors.getToken, currentUnit));
          });

          it('should throw error if !currentToken', () => {
            const clone = gen.clone();
            expect(() => clone.next(false)).toThrowError('Could not find token during unit swap');
          });
        };

        const sharedLogicB = (
          gen: SagaIterator,
          input: string,
          raw: string,
          value: BN,
          currentUnit: string,
          isValid: boolean
        ) => {
          it('should call rebaseUserInput with input', () => {
            expect(gen.next(input).value).toEqual(
              call(transactionHelpers.rebaseUserInput, input as any)
            );
          });

          it('should call validateInput with value and currentUnit', () => {
            expect(gen.next({ raw, value }).value).toEqual(
              call(transactionHelpers.validateInput, value, currentUnit)
            );
          });

          it('should select getTo', () => {
            expect(gen.next(isValid).value).toEqual(select(transactionFieldsSelectors.getTo));
          });
        };

        const constructExpectedPayload = (
          data: Buffer,
          toAddress: string,
          raw: string,
          value: BN,
          decimal: number,
          tokenTo?: any
        ) => {
          const base = {
            data: { raw: bufferToHex(data), value: data },
            to: { raw: '', value: Address(toAddress) },
            tokenValue: { raw, value },
            decimal
          };
          if (!tokenTo) {
            return base;
          }
          return {
            ...base,
            tokenTo
          };
        };

        describe('etherToToken', () => {
          const previousUnit = 'ETH';
          const currentUnit = 'token';
          const action: any = {
            payload: currentUnit
          };
          const currentToken = {
            address: '0x0'
          };
          const decimal = 1;
          const input = 'input';
          const raw = 'raw';
          const value = Wei('100');
          const isValid = true;
          const to = { value: value.toBuffer() };

          const gens: any = {};
          gens.gen = cloneableGenerator(sagas.handleSetUnitMeta)(action);

          expectedStart(gens.gen, previousUnit, currentUnit, true, false);

          sharedLogicA(gens.gen, decimal, currentUnit);

          it('should select getValue', () => {
            expect(gens.gen.next(currentToken).value).toEqual(
              select(transactionFieldsSelectors.getValue)
            );
          });

          sharedLogicB(gens.gen, input, raw, value, currentUnit, isValid);

          it('should put setSchedulingToogle', () => {
            expect(gens.gen.next(to).value).toEqual(
              put(
                scheduleActions.setSchedulingToggle({
                  value: false
                })
              )
            );
          });

          it('should put swapEtherToToken', () => {
            const data = encodeTransfer(to.value, value);
            const payload: any = constructExpectedPayload(
              data,
              currentToken.address,
              raw,
              value,
              decimal,
              to
            );

            expect(gens.gen.next(to).value).toEqual(
              put(transactionActions.swapEtherToToken(payload))
            );
          });

          itShouldBeDone(gens.gen);
        });

        describe('tokenToToken', () => {
          const previousUnit = 'token';
          const currentUnit = 'token';
          const action: any = {
            payload: currentUnit
          };
          const currentToken = {
            address: '0x1'
          };
          const decimal = 1;
          const input = 'input';
          const raw = 'raw';
          const value = Wei('100');
          const isValid = true;
          const to = { value: '0xa' };
          const tokenTo = { value: '0xb' };

          const gens: any = {};
          gens.gen = cloneableGenerator(sagas.handleSetUnitMeta)(action);

          expectedStart(gens.gen, previousUnit, currentUnit, false, false);

          sharedLogicA(gens.gen, decimal, currentUnit);

          it('should select getTokenValue', () => {
            expect(gens.gen.next(currentToken).value).toEqual(select(selectors.getTokenValue));
          });

          sharedLogicB(gens.gen, input, raw, value, currentUnit, isValid);

          it('should select getTokenTo', () => {
            expect(gens.gen.next(to).value).toEqual(select(selectors.getTokenTo));
          });

          it('should put swapEtherToToken', () => {
            const data = encodeTransfer(Address(tokenTo.value), value);
            const payload = constructExpectedPayload(
              data,
              currentToken.address,
              raw,
              value,
              decimal
            );
            expect(gens.gen.next(tokenTo).value).toEqual(
              put(transactionActions.swapTokenToToken(payload))
            );
          });

          itShouldBeDone(gens.gen);
        });
      });
    });
  });
});
