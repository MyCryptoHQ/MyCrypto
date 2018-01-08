import { isEtherTransaction } from 'selectors/transaction';
import { setToField } from 'actions/transaction/actionCreators/fields';
import { setTokenTo } from 'actions/transaction/actionCreators/meta';
import { Address } from 'libs/units';
import { select, call, put } from 'redux-saga/effects';
import { isValidETHAddress, isValidENSAddress } from 'libs/validators';
import { setCurrentTo } from 'sagas/transaction/current/currentTo';
import { cloneableGenerator } from 'redux-saga/utils';

describe('setCurrentTo*', () => {
  const raw = '0xa';
  const action: any = {
    payload: raw
  };
  const validAddress = true;
  const validEns = false;
  const etherTransaction = true;
  const payload = {
    raw,
    value: Address(raw),
    error: null
  };

  const gens: any = {};
  gens.gen = cloneableGenerator(setCurrentTo)(action);

  it('should call isValidETHAddress', () => {
    expect(gens.gen.next().value).toEqual(call(isValidETHAddress, raw));
  });

  it('should call isValidENSAddress', () => {
    expect(gens.gen.next(validAddress).value).toEqual(call(isValidENSAddress, raw));
  });

  it('should select isEtherTransaction', () => {
    expect(gens.gen.next(validEns).value).toEqual(select(isEtherTransaction));
  });

  it('should put setToField if etherTransaction', () => {
    gens.ethTransaction = gens.gen.clone();
    expect(gens.ethTransaction.next(etherTransaction).value).toEqual(put(setToField(payload)));
  });

  it('setToField should be done', () => {
    expect(gens.ethTransaction.next().done).toEqual(true);
  });

  it('should put setTokenTo if !etherTransaction', () => {
    expect(gens.gen.next(!etherTransaction).value).toEqual(put(setTokenTo(payload)));
  });

  it('setTokenTo should be done', () => {
    expect(gens.gen.next().done).toEqual(true);
  });
});
