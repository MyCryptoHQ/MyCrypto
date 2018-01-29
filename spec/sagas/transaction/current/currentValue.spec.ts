import { isEtherTransaction, getUnit, getDecimal, getCurrentValue } from 'selectors/transaction';
import { select, call, put } from 'redux-saga/effects';
import { setTokenValue, setValueField } from 'actions/transaction/actionCreators';
import { toTokenBase, Wei } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';
import {
  setCurrentValue,
  revalidateCurrentValue,
  reparseCurrentValue,
  valueHandler
} from 'sagas/transaction/current/currentValue';
import { cloneableGenerator } from 'redux-saga/utils';

const itShouldBeDone = gen => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('valueHandler', () => {
  const action: any = { payload: '5' };
  const setter = setValueField;
  const decimal = 1;
  const gen: any = {};
  gen.case1 = cloneableGenerator(valueHandler)(action, setter);
  const value = toTokenBase(action.payload, decimal);
  const unit = 'eth';

  it('should select getDecimal', () => {
    expect(gen.case1.next().value).toEqual(select(getDecimal));
  });
  it('should select getUnit', () => {
    expect(gen.case1.next(decimal).value).toEqual(select(getUnit));
  });

  it('should call isValid', () => {
    expect(gen.case1.next(unit).value).toEqual(call(validateInput, value, unit));
  });
  it('should put setter', () => {
    expect(gen.case1.next(true).value).toEqual(put(setter({ raw: action.payload, value })));
  });

  itShouldBeDone(gen.case1);
});

describe('setCurrentValue*', () => {
  const action: any = { payload: '5' };
  const gen = setCurrentValue(action);
  it('should select isEtherTransaction', () => {
    expect(gen.next().value).toEqual(select(isEtherTransaction));
  });
  it('should call valueHandler', () => {
    expect(gen.next(isEtherTransaction).value).toEqual(call(valueHandler, action, setValueField));
  });
  itShouldBeDone(gen);
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
