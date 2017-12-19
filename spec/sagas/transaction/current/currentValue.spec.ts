import { isEtherTransaction, getUnit, getDecimal, getCurrentValue } from 'selectors/transaction';
import { select, call, put } from 'redux-saga/effects';
import { setTokenValue, setValueField } from 'actions/transaction/actionCreators';
import { toTokenBase } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';
import {
  setCurrentValue,
  revalidateCurrentValue,
  reparseCurrentValue
} from 'sagas/transaction/current/currentValue';

const itShouldBeDone = gen => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('setCurrentValue*', () => {
  const sharedLogic = (gen, etherTransaction, decimal: number) => {
    it('should select isEtherTransaction', () => {
      expect(gen.next().value).toEqual(select(isEtherTransaction));
    });

    it('should select getDecimal', () => {
      expect(gen.next(etherTransaction).value).toEqual(select(getDecimal));
    });
    it('should select getUnit', () => {
      expect(gen.next(decimal).value).toEqual(select(getUnit));
    });
  };

  describe('when invalid number or decimal', () => {
    const invalidDecimal: any = {
      payload: '10.01'
    };
    const invalidNumber: any = {
      payload: 'invalidNumber'
    };
    const etherTransaction = true;
    const decimal = 1;
    const gen1 = setCurrentValue(invalidNumber);
    const gen2 = setCurrentValue(invalidDecimal);

    sharedLogic(gen2, etherTransaction, decimal);
    sharedLogic(gen1, etherTransaction, decimal);

    it('should put setter', () => {
      expect(gen1.next().value).toEqual(
        put(setValueField({ raw: invalidNumber.payload, value: null }))
      );
      expect(gen2.next().value).toEqual(
        put(setValueField({ raw: invalidDecimal.payload, value: null }))
      );
    });

    itShouldBeDone(gen1);
    itShouldBeDone(gen2);
  });

  describe('when valid number and decimal', () => {
    const payload = '100';
    const action: any = { payload };
    const etherTransaction = true;
    const unit = 'ether';
    const decimal = 0;
    const value = toTokenBase(payload, decimal);
    const isValid = true;

    const gen = setCurrentValue(action);

    sharedLogic(gen, etherTransaction, decimal);
    it('should call validateInput', () => {
      expect(gen.next(unit).value).toEqual(call(validateInput, value, unit));
    });

    it('should put setter', () => {
      expect(gen.next(isValid).value).toEqual(
        put(
          setValueField({
            raw: payload,
            value
          })
        )
      );
    });

    itShouldBeDone(gen);
  });
});

describe('revalidateCurrentValue*', () => {
  const sharedLogic = (gen, etherTransaction, currVal, reparsedValue) => {
    it('should select isEtherTransaction', () => {
      expect(gen.next().value).toEqual(select(isEtherTransaction));
    });

    it('should select getCurrentValue', () => {
      expect(gen.next(etherTransaction).value).toEqual(select(getCurrentValue));
    });

    it('should call reparseCurrentValue', () => {
      expect(gen.next(currVal).value).toEqual(call(reparseCurrentValue, currVal));
    });

    it('should select getUnit', () => {
      expect(gen.next(reparsedValue).value).toEqual(select(getUnit));
    });
  };

  describe('when !reparsedValue', () => {
    const etherTransaction = false;
    const currVal = {
      raw: 'raw1'
    };
    const reparsedValue = false;
    const gen = revalidateCurrentValue();

    sharedLogic(gen, etherTransaction, currVal, reparsedValue);

    it('should put with setTokenValue', () => {
      expect(gen.next().value).toEqual(
        put(
          setTokenValue({
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
    const gen = revalidateCurrentValue();
    sharedLogic(gen, etherTransaction, currVal, reparsedValue);

    it('should call validateInput', () => {
      expect(gen.next(unit).value).toEqual(call(validateInput, reparsedValue.value, unit));
    });

    it('should put setValueField', () => {
      expect(gen.next(isValid).value).toEqual(
        put(
          setValueField({
            raw: reparsedValue.raw,
            value: reparsedValue.value
          } as any)
        )
      );
    });

    itShouldBeDone(gen);
  });
});

describe('reparseCurrentValue*', () => {
  const sharedLogic = gen => {
    it('should select getDecimal', () => {
      expect(gen.next().value).toEqual(select(getDecimal));
    });
  };

  describe('when valid number and valid decimal', () => {
    const value: any = {
      raw: '100.0000'
    };
    const decimal = 5;
    const gen = reparseCurrentValue(value);

    sharedLogic(gen);

    it('should return correctly', () => {
      expect(gen.next(decimal).value).toEqual({
        raw: value.raw,
        value: toTokenBase(value.raw, decimal)
      });
    });

    itShouldBeDone(gen);
  });

  describe('when invalid number', () => {
    const value: any = {
      raw: 'invalidNumber'
    };
    const decimal = 5;
    const gen = reparseCurrentValue(value);

    sharedLogic(gen);

    it('should return null', () => {
      expect(gen.next(decimal).value).toEqual(null);
    });

    itShouldBeDone(gen);
  });
});
