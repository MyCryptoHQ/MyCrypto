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
  getDecimalFromUnit,
  getGasLimit,
  getGasPrice
} from 'selectors/transaction';
import { getToken, MergedToken, getEtherBalance, getTokenBalance } from 'selectors/wallet';
import { isEtherUnit, toTokenBase, TokenValue, Wei, Address, fromTokenBase } from 'libs/units';
import {
  swapTokenToEther,
  swapEtherToToken,
  swapTokenToToken
} from 'actions/transaction/actionCreators/swap';
import { encodeTransfer, makeTransaction } from 'libs/transaction';
import { AppState } from 'reducers';
import { bufferToHex } from 'ethereumjs-util';
import { validNumber } from 'libs/validators';
import {
  rebaseUserInput,
  validateInput,
  makeCostCalculationTx
} from 'sagas/transaction/validationHelpers';
import { cloneableGenerator } from 'redux-saga/utils';
import { handleSetUnitMeta } from 'sagas/transaction/meta/unitSwap';
import { currentId } from 'async_hooks';
import { getOffline } from 'selectors/config';

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

describe('validateInput*', () => {
  const input = 'input';
  const unit = 'unit';
  const etherBalance = Wei('1000');
  const isOffline = false;
  const etherTransaction = true;
  const validationTx = {
    gasLimit: Wei('30'),
    gasPrice: Wei('1'),
    value: Wei('10')
  };

  const gens: any = {};
  gens.gen = cloneableGenerator(validateInput)(input, unit);

  it('should return when !input', () => {
    expect(validateInput(false).next().done).toEqual(true);
  });

  it('should select getEtherBalance', () => {
    gens.clone2 = gens.gen.clone();
    expect(gens.gen.next().value).toEqual(select(getEtherBalance));
  });

  it('should select getOffline', () => {
    gens.clone1 = gens.gen.clone();
    gens.clone2 = gens.gen.clone();
    expect(gens.gen.next(etherBalance).value).toEqual(select(getOffline));
  });

  it('should call isEtherUnit', () => {
    expect(gens.gen.next(isOffline).value).toEqual(call(isEtherUnit, unit));
    gens.clone3 = gens.gen.clone();
  });

  it('should return true when offline', () => {
    gens.clone1.next();
    gens.clone1.next(true);
    expect(gens.clone1.next(true).value).toEqual(true);
    expect(gens.clone1.next().done).toEqual(true);
  });

  it('should return when !etherBalance', () => {
    gens.clone2.next(null);
    gens.clone2.next(false);
    expect(gens.clone2.next().value).toEqual(true);
    expect(gens.clone2.next().done).toEqual(true);
  });

  it('should call makeCostCalculationTx', () => {
    expect(gens.gen.next(etherTransaction).value).toEqual(call(makeCostCalculationTx, input));
  });

  it('should return true if etherTransaction', () => {
    expect(gens.gen.next(validationTx).value).toEqual(true);
  });

  it('should select getTokenBalance if !etherTransaction', () => {
    gens.clone3.next(!etherTransaction);
    expect(gens.clone3.next(validationTx).value).toEqual(select(getTokenBalance, unit));
  });

  it('should return true if !etherTransaction', () => {
    expect(gens.clone3.next().value).toEqual(true);
  });
});

describe('makeCostCalculationTx*', () => {
  const value = Wei('100');
  const gasLimit = {
    value: Wei('10')
  };
  const gasPrice = {
    value: Wei('1')
  };
  const txObj = {
    gasLimit: gasLimit.value,
    gasPrice: gasPrice.value,
    value
  };

  const gen = makeCostCalculationTx(value);

  it('should select getGasLimit', () => {
    expect(gen.next().value).toEqual(select(getGasLimit));
  });

  it('should select getGasPrice', () => {
    expect(gen.next(gasLimit).value).toEqual(select(getGasPrice));
  });

  it('should call makeTransaction', () => {
    expect(gen.next(gasPrice).value).toEqual(call(makeTransaction, txObj));
  });

  itShouldBeDone(gen);
});
