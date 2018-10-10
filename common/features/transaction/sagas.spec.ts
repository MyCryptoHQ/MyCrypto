import BN from 'bn.js';
import { SagaIterator } from 'redux-saga';
import { call, select, put, take, apply } from 'redux-saga/effects';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';

import { Address, toTokenBase, Wei, fromTokenBase, fromWei } from 'libs/units';
import { isValidENSAddress, getIsValidAddressFunction } from 'libs/validators';
import configuredStore from 'features/store';
import { ICurrentValue } from 'features/types';
import * as derivedSelectors from 'features/selectors';
import * as configSelectors from 'features/config/selectors';
import { ensTypes, ensActions, ensSelectors } from 'features/ens';
import { walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsActions } from './fields';
import { transactionMetaActions, transactionMetaSelectors } from './meta';
import * as actions from './actions';
import * as sagas from './sagas';
import * as helpers from './helpers';

configuredStore.getState();

describe('transaction: Sagas', () => {
  describe('Current', () => {
    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('setCurrentTo*', () => {
      const isValidAddress = getIsValidAddressFunction(1);
      const data = {} as any;

      describe('with valid Ethereum address', () => {
        const raw = '0xa';
        const ethAddrPayload = {
          raw,
          value: Address(raw)
        };
        const ethAddrAction: any = {
          payload: raw
        };

        data.validEthGen = sagas.setCurrentToSaga(ethAddrAction);

        it('should select getIsValidAddressFn', () => {
          expect(data.validEthGen.next().value).toEqual(
            select(configSelectors.getIsValidAddressFn)
          );
        });

        it('should call isValidAddress', () => {
          expect(data.validEthGen.next(isValidAddress).value).toEqual(call(isValidAddress, raw));
        });

        it('should call isValidENSAddress', () => {
          expect(data.validEthGen.next(raw).value).toEqual(call(isValidENSAddress, raw));
        });

        it('should call setField', () => {
          expect(data.validEthGen.next(raw).value).toEqual(call(sagas.setField, ethAddrPayload));
        });
      });

      describe('with invalid Ethereum address, valid ENS address', () => {
        const raw = 'testing.eth';
        const resolvedAddress = '0xa';
        const ensAddrPayload = {
          raw,
          value: null
        };
        const ensAddrAction: any = {
          payload: raw
        };
        data.validEnsGen = sagas.setCurrentToSaga(ensAddrAction);

        it('should select getIsValidAddressFn', () => {
          expect(data.validEnsGen.next().value).toEqual(
            select(configSelectors.getIsValidAddressFn)
          );
        });

        it('should call isValidAddress', () => {
          expect(data.validEnsGen.next(isValidAddress).value).toEqual(call(isValidAddress, raw));
        });

        it('should call isValidENSAddress', () => {
          expect(data.validEnsGen.next(false).value).toEqual(call(isValidENSAddress, raw));
        });

        it('should call setField', () => {
          expect(data.validEnsGen.next(true).value).toEqual(call(sagas.setField, ensAddrPayload));
        });

        it('should put resolveDomainRequested', () => {
          expect(data.validEnsGen.next().value).toEqual(
            put(ensActions.resolveDomainRequested(raw))
          );
        });

        it('should take ENS type keys', () => {
          expect(data.validEnsGen.next().value).toEqual(
            take([
              ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED,
              ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
              ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED
            ])
          );
        });

        it('should select getResolvedAddress', () => {
          expect(data.validEnsGen.next().value).toEqual(
            select(ensSelectors.getResolvedAddress, true)
          );
        });

        it('should call setField', () => {
          expect(data.validEnsGen.next(resolvedAddress).value).toEqual(
            call(sagas.setField, { raw, value: Address(resolvedAddress) })
          );
        });
      });
    });

    describe('setField', () => {
      const raw = '0xa';
      const payload = {
        raw,
        value: Address(raw)
      };
      const etherTransaction = cloneableGenerator(sagas.setField)(payload);
      it('should select etherTransaction', () => {
        expect(etherTransaction.next().value).toEqual(select(derivedSelectors.isEtherTransaction));
      });

      it('should put setTokenTo field if its a token transaction ', () => {
        const tokenTransaction = etherTransaction.clone();

        expect(tokenTransaction.next(false).value).toEqual(
          put(transactionMetaActions.setTokenTo(payload))
        );
        expect(tokenTransaction.next().done).toBe(true);
      });
      it('should put setToField if its an etherTransaction', () => {
        expect(etherTransaction.next(true).value).toEqual(
          put(transactionFieldsActions.setToField(payload))
        );
        expect(etherTransaction.next().done).toBe(true);
      });
    });

    describe('valueHandler', () => {
      const action: any = { payload: '5.1' };
      const zeroAction: any = { payload: '0' };
      const setter = transactionFieldsActions.setValueField;
      const decimal = 1;
      const gen: { [key: string]: SagaIteratorClone } = {};

      const failCases = {
        invalidDecimal: 0,
        invalidNumber: {
          decimal: 1,
          action: { payload: 'x' }
        },
        invalidZeroToken: {
          unit: 'GNT',
          isEth: false,
          setter: transactionMetaActions.setTokenValue
        }
      };

      gen.pass = cloneableGenerator(sagas.valueHandler)(action, setter);
      gen.zeroPass = cloneableGenerator(sagas.valueHandler)(zeroAction, setter);
      gen.invalidNumber = cloneableGenerator(sagas.valueHandler)(
        failCases.invalidNumber.action as any,
        setter
      );
      gen.invalidZeroToken = cloneableGenerator(sagas.valueHandler)(
        zeroAction,
        transactionMetaActions.setTokenValue
      );
      const value = toTokenBase(action.payload, decimal);
      const zeroValue = toTokenBase(zeroAction.payload, decimal);
      const unit = 'eth';
      const isEth = true;

      it('should select getDecimal', () => {
        expect(gen.pass.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(gen.zeroPass.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(gen.invalidNumber.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(gen.invalidZeroToken.next().value).toEqual(
          select(transactionMetaSelectors.getDecimal)
        );
      });

      it('should select getUnit', () => {
        gen.invalidDecimal = gen.pass.clone();
        expect(gen.pass.next(decimal).value).toEqual(select(derivedSelectors.getUnit));
        expect(gen.zeroPass.next(decimal).value).toEqual(select(derivedSelectors.getUnit));
        expect(gen.invalidNumber.next(decimal).value).toEqual(select(derivedSelectors.getUnit));
        expect(gen.invalidDecimal.next(failCases.invalidDecimal).value).toEqual(
          select(derivedSelectors.getUnit)
        );
        expect(gen.invalidZeroToken.next(decimal).value).toEqual(select(derivedSelectors.getUnit));
      });

      it('should select isEtherTransaction', () => {
        expect(gen.pass.next(unit).value).toEqual(select(derivedSelectors.isEtherTransaction));
        expect(gen.zeroPass.next(unit).value).toEqual(select(derivedSelectors.isEtherTransaction));
        expect(gen.invalidNumber.next(unit).value).toEqual(
          select(derivedSelectors.isEtherTransaction)
        );
        expect(gen.invalidDecimal.next(unit).value).toEqual(
          select(derivedSelectors.isEtherTransaction)
        );
        expect(gen.invalidZeroToken.next(failCases.invalidZeroToken.unit).value).toEqual(
          select(derivedSelectors.isEtherTransaction)
        );
      });

      it('should fail on invalid number or decimal and put null as value', () => {
        expect(gen.invalidNumber.next(isEth).value).toEqual(
          put(setter({ raw: failCases.invalidNumber.action.payload, value: null }))
        );
        expect(gen.invalidDecimal.next(isEth).value).toEqual(
          put(setter({ raw: action.payload, value: null }))
        );
      });

      it('should fail if token is given zero value and put null as value', () => {
        expect(gen.invalidZeroToken.next(failCases.invalidZeroToken.isEth).value).toEqual(
          put(failCases.invalidZeroToken.setter({ raw: zeroAction.payload, value: null }))
        );
      });

      it('should call isValid', () => {
        expect(gen.pass.next(isEth).value).toEqual(call(helpers.validateInput, value, unit));
        expect(gen.zeroPass.next(isEth).value).toEqual(
          call(helpers.validateInput, zeroValue, unit)
        );
      });

      it('should put setter', () => {
        expect(gen.pass.next(true).value).toEqual(put(setter({ raw: action.payload, value })));
        expect(gen.zeroPass.next(true).value).toEqual(
          put(
            setter({
              raw: zeroAction.payload,
              value: zeroValue
            })
          )
        );
      });

      it('handles floats without lead zero', () => {
        const leadZeroValue = {
          decimal: 18,
          action: {
            payload: '.1'
          }
        };
        const g = cloneableGenerator(sagas.valueHandler)(leadZeroValue.action as any, setter);

        expect(g.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(g.next(leadZeroValue.decimal).value).toEqual(select(derivedSelectors.getUnit));
        expect(g.next(unit).value).toEqual(select(derivedSelectors.isEtherTransaction));
        expect(g.next(isEth).value).not.toEqual(
          put(setter({ raw: leadZeroValue.action.payload, value: null }))
        );
      });

      itShouldBeDone(gen.pass);
      itShouldBeDone(gen.zeroPass);
    });

    describe('setCurrentValue*', () => {
      const action: any = { payload: '5' };
      const gen = sagas.setCurrentValueSaga(action);
      it('should select isEtherTransaction', () => {
        expect(gen.next().value).toEqual(select(derivedSelectors.isEtherTransaction));
      });
      it('should call valueHandler', () => {
        expect(gen.next(derivedSelectors.isEtherTransaction).value).toEqual(
          call(sagas.valueHandler, action, transactionFieldsActions.setValueField)
        );
      });
      itShouldBeDone(gen);
    });

    describe('revalidateCurrentValue*', () => {
      const sharedLogic = (
        gen: SagaIterator,
        etherTransaction: boolean,
        currVal: any,
        reparsedValue: boolean
      ) => {
        it('should select isEtherTransaction', () => {
          expect(gen.next().value).toEqual(select(derivedSelectors.isEtherTransaction));
        });

        it('should select getCurrentValue', () => {
          expect(gen.next(etherTransaction).value).toEqual(
            select(derivedSelectors.getCurrentValue)
          );
        });

        it('should call reparseCurrentValue', () => {
          expect(gen.next(currVal).value).toEqual(call(sagas.reparseCurrentValue, currVal));
        });

        it('should select getUnit', () => {
          expect(gen.next(reparsedValue).value).toEqual(select(derivedSelectors.getUnit));
        });
      };

      describe('when !reparsedValue', () => {
        const etherTransaction = false;
        const currVal = {
          raw: 'raw1'
        };
        const reparsedValue = false;
        const gen = sagas.revalidateCurrentValue();

        sharedLogic(gen, etherTransaction, currVal, reparsedValue);

        it('should put with setTokenValue', () => {
          expect(gen.next().value).toEqual(
            put(
              transactionMetaActions.setTokenValue({
                raw: currVal.raw,
                value: null
              })
            )
          );
        });

        itShouldBeDone(gen);
      });

      describe('when reparsedValue', () => {
        const etherTransaction = true;
        const currVal = {
          raw: 'raw1'
        };
        const reparsedValue: any = {
          value: 'value',
          raw: 'raw'
        };
        const unit = 'unit';
        const isValid = true;
        const gen = sagas.revalidateCurrentValue();
        sharedLogic(gen, etherTransaction, currVal, reparsedValue);

        it('should call validateInput', () => {
          expect(gen.next(unit).value).toEqual(
            call(helpers.validateInput, reparsedValue.value, unit)
          );
        });

        it('should put setValueField', () => {
          expect(gen.next(isValid).value).toEqual(
            put(
              transactionFieldsActions.setValueField({
                raw: reparsedValue.raw,
                value: reparsedValue.value
              } as any)
            )
          );
        });

        itShouldBeDone(gen);
      });
    });

    describe('isValueDifferent', () => {
      it('should be truthy when raw differs', () => {
        const curVal: ICurrentValue = { raw: 'a', value: new BN(0) };
        const newVal: ICurrentValue = { raw: 'b', value: new BN(0) };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeTruthy();
      });

      it('should be falsy when value is the same BN', () => {
        const curVal: ICurrentValue = { raw: '', value: new BN(1) };
        const newVal: ICurrentValue = { raw: '', value: new BN(1) };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeFalsy();
      });

      it('should be truthy when value is a different BN', () => {
        const curVal: ICurrentValue = { raw: '', value: new BN(1) };
        const newVal: ICurrentValue = { raw: '', value: new BN(2) };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeTruthy();
      });

      it('should be truthy when value is not the same and not both BNs', () => {
        const curVal: ICurrentValue = { raw: '', value: new BN(1) };
        const newVal: ICurrentValue = { raw: '', value: null };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeTruthy();
      });
    });

    describe('reparseCurrentValue*', () => {
      const decimal = 5;

      const sharedLogic = (gen: SagaIterator, isEth: boolean) => {
        it('should select isEtherTransaction', () => {
          expect(gen.next().value).toEqual(select(derivedSelectors.isEtherTransaction));
        });

        it('should select getDecimal', () => {
          expect(gen.next(isEth).value).toEqual(select(transactionMetaSelectors.getDecimal));
        });
      };

      describe('when eth tx value is positive number and valid decimal', () => {
        const value: any = {
          raw: '100.0000'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, true);

        it('should return correctly', () => {
          expect(gen.next(decimal).value).toEqual({
            raw: value.raw,
            value: toTokenBase(value.raw, decimal)
          });
        });

        itShouldBeDone(gen);
      });

      describe('when eth tx value is zero and decimal is valid', () => {
        const value: any = {
          raw: '0'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, true);

        it('should return correctly', () => {
          expect(gen.next(decimal).value).toEqual({
            raw: value.raw,
            value: toTokenBase(value.raw, decimal)
          });
        });

        itShouldBeDone(gen);
      });

      describe('when eth tx value is invalid', () => {
        const value: any = {
          raw: 'invalidNumber'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, true);

        it('should return null', () => {
          expect(gen.next(decimal).value).toEqual(null);
        });

        itShouldBeDone(gen);
      });

      describe('when non-eth tx value is zero and valid decimal', () => {
        const value: any = {
          raw: '0'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, false);

        it('should return null', () => {
          expect(gen.next(decimal).value).toEqual(null);
        });

        itShouldBeDone(gen);
      });
    });
  });
  describe('Reset', () => {
    describe('resetTransactionState*', () => {
      const gen = sagas.resetTransactionState();

      it('should check if this is a contract interaction tab', () => {
        expect(gen.next().value).toEqual(select(transactionMetaSelectors.isContractInteraction));
      });
      it('should put resetActionCreator', () => {
        expect(gen.next(false).value).toEqual(
          put(transactionFieldsActions.resetTransactionSuccessful({ isContractInteraction: false }))
        );
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });
  });
  describe('Send Everything', () => {
    describe('handleSendEverything*', () => {
      let random: () => number;
      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      const sharedStart = (gen: SagaIterator, transactionObj: any, currentBalance: BN | null) => {
        it('should select getTransaction', () => {
          expect(gen.next().value).toEqual(select(derivedSelectors.getTransaction));
        });

        it('should select getCurrentBalance', () => {
          expect(gen.next(transactionObj).value).toEqual(
            select(derivedSelectors.getCurrentBalance)
          );
        });

        it('should select getEtherBalance', () => {
          expect(gen.next(currentBalance).value).toEqual(select(walletSelectors.getEtherBalance));
        });
      };

      describe('!etherBalance', () => {
        const transactionObj = {
          transaction: 'transaction'
        };
        const currentBalance = Wei('100');
        const etherBalance = null;
        const gen = sagas.handleSendEverything();

        sharedStart(gen, transactionObj, currentBalance);

        it('should put sendEverythingFailed', () => {
          expect(gen.next(etherBalance).value).toEqual(put(actions.sendEverythingFailed()));
        });
      });

      describe('!currentBalance', () => {
        const transactionObj = {
          transaction: 'transaction'
        };
        const currentBalance = null;
        const etherBalance = Wei('100');
        const gen = sagas.handleSendEverything();

        sharedStart(gen, transactionObj, currentBalance);

        it('should put sendEverythingFailed', () => {
          expect(gen.next(etherBalance).value).toEqual(put(actions.sendEverythingFailed()));
        });
      });

      describe('etherBalance && currentBalance', () => {
        const transaction = {
          getUpfrontCost: jest.fn()
        };
        const transactionObj = { transaction };
        const currentBalance = Wei('100');
        const etherBalance = Wei('100');
        const etherTransaction = true;

        const gens: any = {};
        gens.gen = cloneableGenerator(sagas.handleSendEverything)();
        gens.clone1 = {};
        gens.clone2 = {};

        sharedStart(gens.gen, transactionObj, currentBalance);

        it('should select isEtherTransaction', () => {
          expect(gens.gen.next(etherBalance).value).toEqual(
            select(derivedSelectors.isEtherTransaction)
          );
        });

        it('should apply transaction.getUpfrontCost', () => {
          gens.clone2 = gens.gen.clone();
          expect(gens.gen.next(etherTransaction).value).toEqual(
            apply(transaction, transaction.getUpfrontCost)
          );
          gens.clone1 = gens.gen.clone();
        });

        describe('if totalCost > etherBalance', () => {
          const totalCost = Wei('1000');

          it('should put showNotification', () => {
            expect(gens.clone1.next(totalCost).value).toEqual(
              put(
                notificationsActions.showNotification(
                  'warning',
                  `The cost of gas is higher than your balance. Total cost: ${totalCost} >  Your Ether balance: ${etherBalance}`
                )
              )
            );
          });

          it('should put sendEverythingFailed', () => {
            expect(gens.clone1.next().value).toEqual(put(actions.sendEverythingFailed()));
          });

          it('should put setValueField', () => {
            expect(gens.clone1.next().value).toEqual(
              put(transactionFieldsActions.setValueField({ raw: '0', value: null }))
            );
          });

          it('should be done', () => {
            expect(gens.clone1.next().done).toEqual(true);
          });
        });

        describe('if etherTransaction', () => {
          const totalCost = Wei('10');
          const remainder = currentBalance.sub(totalCost);
          const rawVersion = fromWei(remainder, 'ether');

          it('should put setValueField', () => {
            expect(gens.gen.next(totalCost).value).toEqual(
              put(
                transactionFieldsActions.setValueField({
                  raw: rawVersion,
                  value: remainder
                })
              )
            );
          });

          it('should put sendEverythingSucceeded', () => {
            expect(gens.gen.next().value).toEqual(put(actions.sendEverythingSucceeded()));
          });

          it('should be done', () => {
            expect(gens.gen.next().done).toEqual(true);
          });
        });

        describe('if !etherTransaction (a token tx)', () => {
          const totalCostLocal = Wei('1');
          const etherTransactionLocal = false;
          const decimal = 3;
          const rawVersion = fromTokenBase(currentBalance, decimal);

          it('should apply transaction.getUpfrontCost', () => {
            expect(gens.clone2.next(etherTransactionLocal).value).toEqual(
              apply(transaction, transaction.getUpfrontCost)
            );
          });

          it('should select getDecimal', () => {
            expect(gens.clone2.next(totalCostLocal).value).toEqual(
              select(transactionMetaSelectors.getDecimal)
            );
          });

          it('should put setTokenValue', () => {
            expect(gens.clone2.next(decimal).value).toEqual(
              put(transactionMetaActions.setTokenValue({ raw: rawVersion, value: currentBalance }))
            );
          });

          it('should put sendEverythingSucceeded', () => {
            expect(gens.clone2.next().value).toEqual(put(actions.sendEverythingSucceeded()));
          });

          it('should be done', () => {
            expect(gens.clone2.next().done).toEqual(true);
          });
        });
      });
    });
  });
});
