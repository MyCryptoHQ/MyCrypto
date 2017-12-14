import { isEtherTransaction } from 'selectors/transaction';
import { setToField } from 'actions/transaction/actionCreators/fields';
import { setTokenTo } from 'actions/transaction/actionCreators/meta';
import { Address } from 'libs/units';
import { select, call, put } from 'redux-saga/effects';
import { isValidENSorEtherAddress } from 'libs/validators';
import { setCurrentTo } from 'sagas/transaction/current/currentTo';
import { cloneableGenerator } from 'redux-saga/utils';

describe('setCurrentTo*', () => {
  const raw = '0xa';
  const action: any = {
    payload: raw
  };
  const validAddress = true;
  const etherTransaction = true;
  const payload = {
    raw,
    value: Address(raw)
  };

  const gens: any = {};
  gens.gen = cloneableGenerator(setCurrentTo)(action);

  it('should call isValidENSorEtherAddress', () => {
    expect(gens.gen.next().value).toEqual(call(isValidENSorEtherAddress, raw));
  });

  it('should select isEtherTransaction', () => {
    expect(gens.gen.next(validAddress).value).toEqual(select(isEtherTransaction));
  });

  it('should put setToField if etherTransaction', () => {
    gens.clone1 = gens.gen.clone();
    expect(gens.clone1.next(etherTransaction).value).toEqual(put(setToField(payload)));
  });

  it('should put setTokenTo if !etherTransaction', () => {
    expect(gens.gen.next(!etherTransaction).value).toEqual(put(setTokenTo(payload)));
  });

  it('should be done', () => {
    expect(gens.clone1.next().done).toEqual(true);
  });

  it('should be done', () => {
    expect(gens.gen.next().done).toEqual(true);
  });
});
