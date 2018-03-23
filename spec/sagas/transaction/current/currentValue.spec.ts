import { isEtherTransaction, getUnit, getDecimal, getCurrentValue } from 'selectors/transaction';
import { select, call, put } from 'redux-saga/effects';
import { setTokenValue, setValueField } from 'actions/transaction/actionCreators';
import { toTokenBase } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';
import {
  setCurrentValue,
  revalidateCurrentValue,
  reparseCurrentValue,
  valueHandler
} from 'sagas/transaction/current/currentValue';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';
import { SagaIterator } from 'redux-saga';

const itShouldBeDone = (gen: SagaIterator) => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('valueHandler', () => {
  const action: any = { payload: '5.1' };
  const zeroAction: any = { payload: '0' };
  const setter = setValueField;
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
      setter: setTokenValue
    }
  };

  gen.pass = cloneableGenerator(valueHandler)(action, setter);
  gen.zeroPass = cloneableGenerator(valueHandler)(zeroAction, setter);
  gen.invalidNumber = cloneableGenerator(valueHandler)(
    failCases.invalidNumber.action as any,
    setter
  );
  gen.invalidZeroToken = cloneableGenerator(valueHandler)(zeroAction, setTokenValue);
  const value = toTokenBase(action.payload, decimal);
  const zeroValue = toTokenBase(zeroAction.payload, decimal);
  const unit = 'eth';
  const isEth = true;

  it('should select getDecimal', () => {
    expect(gen.pass.next().value).toEqual(select(getDecimal));
    expect(gen.zeroPass.next().value).toEqual(select(getDecimal));
    expect(gen.invalidNumber.next().value).toEqual(select(getDecimal));
    expect(gen.invalidZeroToken.next().value).toEqual(select(getDecimal));
  });

  it('should select getUnit', () => {
    gen.invalidDecimal = gen.pass.clone();
    expect(gen.pass.next(decimal).value).toEqual(select(getUnit));
    expect(gen.zeroPass.next(decimal).value).toEqual(select(getUnit));
    expect(gen.invalidNumber.next(decimal).value).toEqual(select(getUnit));
    expect(gen.invalidDecimal.next(failCases.invalidDecimal).value).toEqual(select(getUnit));
    expect(gen.invalidZeroToken.next(decimal).value).toEqual(select(getUnit));
  });

  it('should select isEtherTransaction', () => {
    expect(gen.pass.next(unit).value).toEqual(select(isEtherTransaction));
    expect(gen.zeroPass.next(unit).value).toEqual(select(isEtherTransaction));
    expect(gen.invalidNumber.next(unit).value).toEqual(select(isEtherTransaction));
    expect(gen.invalidDecimal.next(unit).value).toEqual(select(isEtherTransaction));
    expect(gen.invalidZeroToken.next(failCases.invalidZeroToken.unit).value).toEqual(
      select(isEtherTransaction)
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
    expect(gen.pass.next(isEth).value).toEqual(call(validateInput, value, unit));
    expect(gen.zeroPass.next(isEth).value).toEqual(call(validateInput, zeroValue, unit));
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

  itShouldBeDone(gen.pass);
  itShouldBeDone(gen.zeroPass);
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
  const sharedLogic = (
    gen: SagaIterator,
    etherTransaction: boolean,
    currVal: any,
    reparsedValue: boolean
  ) => {
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
  const decimal = 5;

  const sharedLogic = (gen: SagaIterator, isEth: boolean) => {
    it('should select isEtherTransaction', () => {
      expect(gen.next().value).toEqual(select(isEtherTransaction));
    });

    it('should select getDecimal', () => {
      expect(gen.next(isEth).value).toEqual(select(getDecimal));
    });
  };

  describe('when eth tx value is positive number and valid decimal', () => {
    const value: any = {
      raw: '100.0000'
    };
    const gen = reparseCurrentValue(value);

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
    const gen = reparseCurrentValue(value);

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
    const gen = reparseCurrentValue(value);

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
    const gen = reparseCurrentValue(value);

    sharedLogic(gen, false);

    it('should return null', () => {
      expect(gen.next(decimal).value).toEqual(null);
    });

    itShouldBeDone(gen);
  });
});
