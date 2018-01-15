import { Address } from 'libs/units';
import { call, select, put } from 'redux-saga/effects';
import { isValidETHAddress, isValidENSAddress } from 'libs/validators';
import { setCurrentTo, setField } from 'sagas/transaction/current/currentTo';
import { isEtherTransaction } from 'selectors/transaction';
import { cloneableGenerator } from 'redux-saga/utils';
import { setToField, setTokenTo } from 'actions/transaction';
const raw = '0xa';

const payload = {
  raw,
  value: Address(raw)
};

describe('setCurrentTo*', () => {
  const action: any = {
    payload: raw
  };
  const validAddress = true;
  const validEns = false;

  const gen = setCurrentTo(action);

  it('should call isValidETHAddress', () => {
    expect(gen.next().value).toEqual(call(isValidETHAddress, raw));
  });

  it('should call isValidENSAddress', () => {
    expect(gen.next(validAddress).value).toEqual(call(isValidENSAddress, raw));
  });

  it('should call setField', () => {
    expect(gen.next(validEns).value).toEqual(call(setField, payload));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('setField', () => {
  const etherTransaction = cloneableGenerator(setField)(payload);
  it('should select etherTransaction', () => {
    expect(etherTransaction.next().value).toEqual(select(isEtherTransaction));
  });

  it('should put setTokenTo field if its a token transaction ', () => {
    const tokenTransaction = etherTransaction.clone();

    expect(tokenTransaction.next(false).value).toEqual(put(setTokenTo(payload)));
    expect(tokenTransaction.next().done).toBe(true);
  });
  it('should put setToField if its an etherTransaction', () => {
    expect(etherTransaction.next(true).value).toEqual(put(setToField(payload)));
    expect(etherTransaction.next().done).toBe(true);
  });
});
