import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { SetUnitMetaAction, TypeKeys } from 'actions/transaction';
import {
  getUnit,
  getTokenTo,
  getTokenValue,
  getTo,
  getPreviousUnit,
  getValue,
  getDecimalFromUnit
} from 'selectors/transaction';
import { getToken, MergedToken } from 'selectors/wallet';
import { isEtherUnit, toTokenBase, TokenValue, Wei, Address, fromTokenBase } from 'libs/units';
import {
  swapTokenToEther,
  swapEtherToToken,
  swapTokenToToken
} from 'actions/transaction/actionCreators/swap';
import { encodeTransfer } from 'libs/transaction';
import { AppState } from 'reducers';
import { bufferToHex } from 'ethereumjs-util';
import { validNumber } from 'libs/validators';
import { validateInput } from 'sagas/transaction/validationHelpers';
import { cloneableGenerator } from 'redux-saga/utils';
import { rebaseUserInput, handleSetUnitMeta } from 'sagas/transaction/meta/unitSwap';
import { currentId } from 'async_hooks';

const itShouldBeDone = gen => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('rebaseUserInput*', () => {
  const validNumberValue = {
    raw: '1',
    value: Wei('1')
  };
  const notValidNumberValue: any = {
    raw: '0x0',
    value: '0x0'
  };
  const unit = 'unit';
  const newDecimal = 1;
  const prevUnit = 'prevUnit';
  const prevDecimal = 1;

  const gens: any = {};
  gens.gen1 = rebaseUserInput(validNumberValue);
  gens.gen2 = rebaseUserInput(notValidNumberValue);

  describe('when a valid number', () => {
    it('should select getUnit', () => {
      expect(gens.gen1.next().value).toEqual(select(getUnit));
    });

    it('should select getDecimalFromUnit with unit', () => {
      expect(gens.gen1.next(unit).value).toEqual(select(getDecimalFromUnit, unit));
    });

    it('should return correctly', () => {
      expect(gens.gen1.next(newDecimal).value).toEqual({
        raw: validNumberValue.raw,
        value: toTokenBase(validNumberValue.raw, newDecimal)
      });
    });

    itShouldBeDone(gens.gen1);
  });

  describe('when not a valid number', () => {
    it('should select getUnit', () => {
      expect(gens.gen2.next().value).toEqual(select(getUnit));
    });

    it('should select getDecimalFromUnit with unit', () => {
      expect(gens.gen2.next(unit).value).toEqual(select(getDecimalFromUnit, unit));
    });

    it('should select getPreviousUnit', () => {
      expect(gens.gen2.next().value).toEqual(select(getPreviousUnit));
    });

    it('should select getDecimalFromUnit with prevUnit', () => {
      expect(gens.gen2.next(prevUnit).value).toEqual(select(getDecimalFromUnit, prevUnit));
    });

    it('should return correctly', () => {
      const result = JSON.stringify(gens.gen2.next(prevDecimal).value);
      const expected = JSON.stringify({
        raw: notValidNumberValue.raw,
        value: toTokenBase(fromTokenBase(notValidNumberValue.value, prevDecimal), newDecimal)
      });

      expect(result).toEqual(expected);
    });

    itShouldBeDone(gens.gen2);
  });
});

describe('handleSetUnitMeta*', () => {
  const expectedStart = (gen, previousUnit, currentUnit) => {
    it('should select getPreviousUnit', () => {
      expect(gen.next().value).toEqual(select(getPreviousUnit));
    });

    it('should select getDeciimalFromUnit with currentUnit', () => {
      expect(gen.next(previousUnit).value).toEqual(select(getDecimalFromUnit, currentUnit));
    });
  };

  describe('etherToEther', () => {
    const currentUnit = 'ether';
    const previousUnit = 'ether';
    const action: any = {
      payload: currentUnit
    };
    const gen = handleSetUnitMeta(action);

    expectedStart(gen, previousUnit, currentUnit);

    it('should return correctly', () => {
      expect(gen.next().value).toEqual(undefined);
    });

    itShouldBeDone(gen);
  });

  describe('tokenToEther', () => {
    const previousUnit = 'token';
    const currentUnit = 'ether';
    const action: any = {
      payload: currentUnit
    };
    const decimal = 1;
    const tokenTo: any = 'tokenTo';
    const tokenValue: any = 'tokenValue';
    const raw = 'raw';
    const value: any = 'value';
    const gen = handleSetUnitMeta(action);

    expectedStart(gen, previousUnit, currentUnit);

    it('should select getTokenTo', () => {
      expect(gen.next(decimal).value).toEqual(select(getTokenTo));
    });

    it('should select getTokenValue', () => {
      expect(gen.next(tokenTo).value).toEqual(select(getTokenValue));
    });

    it('should call rebaseUserInput with tokenValue', () => {
      expect(gen.next(tokenValue).value).toEqual(call(rebaseUserInput, tokenValue));
    });

    it('should call validateInput with value and currentUnit', () => {
      expect(gen.next({ value, raw }).value).toEqual(call(validateInput, value, currentUnit));
    });

    it('should put swapTokenToEther', () => {
      expect(gen.next(true).value).toEqual(
        put(
          swapTokenToEther({
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
    const sharedLogicA = (gen, decimal, currentUnit) => {
      it('should select getToken with currentUnit', () => {
        expect(gen.next(decimal).value).toEqual(select(getToken, currentUnit));
      });

      it('should throw error if !currentToken', () => {
        const clone = gen.clone();
        expect(() => clone.next(false)).toThrowError('Could not find token during unit swap');
      });
    };

    const sharedLogicB = (gen, input, raw, value, currentUnit, isValid) => {
      it('should call rebaseUserInput with input', () => {
        expect(gen.next(input).value).toEqual(call(rebaseUserInput, input));
      });

      it('should call validateInput with value and currentUnit', () => {
        expect(gen.next({ raw, value }).value).toEqual(call(validateInput, value, currentUnit));
      });

      it('should select getTo', () => {
        expect(gen.next(isValid).value).toEqual(select(getTo));
      });
    };

    const constructExpectedPayload = (data, toAddress, raw, value, decimal, tokenTo?) => {
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
      const previousUnit = 'ether';
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
      const to = { value };

      const gens: any = {};
      gens.gen = cloneableGenerator(handleSetUnitMeta)(action);

      expectedStart(gens.gen, previousUnit, currentUnit);

      sharedLogicA(gens.gen, decimal, currentUnit);

      it('should select getValue', () => {
        expect(gens.gen.next(currentToken).value).toEqual(select(getValue));
      });

      sharedLogicB(gens.gen, input, raw, value, currentUnit, isValid);

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

        expect(gens.gen.next(to).value).toEqual(put(swapEtherToToken(payload)));
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
      gens.gen = cloneableGenerator(handleSetUnitMeta)(action);

      expectedStart(gens.gen, previousUnit, currentUnit);

      sharedLogicA(gens.gen, decimal, currentUnit);

      it('should select getTokenValue', () => {
        expect(gens.gen.next(currentToken).value).toEqual(select(getTokenValue));
      });

      sharedLogicB(gens.gen, input, raw, value, currentUnit, isValid);

      it('should select getTokenTo', () => {
        expect(gens.gen.next(to).value).toEqual(select(getTokenTo));
      });

      it('should put swapEtherToToken', () => {
        const data = encodeTransfer(Address(tokenTo.value), value);
        const payload = constructExpectedPayload(data, currentToken.address, raw, value, decimal);
        expect(gens.gen.next(tokenTo).value).toEqual(put(swapTokenToToken(payload)));
      });

      itShouldBeDone(gens.gen);
    });
  });
});
