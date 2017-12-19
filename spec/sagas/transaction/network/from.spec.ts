import { apply, put, select } from 'redux-saga/effects';
import { getWalletInst } from 'selectors/wallet';
import { getFromSucceeded, getFromFailed } from 'actions/transaction';
import { showNotification } from 'actions/notifications';
import { cloneableGenerator } from 'redux-saga/utils';
import { handleFromRequest } from 'sagas/transaction/network/from';

describe('handleFromRequest*', () => {
  const walletInst: any = {
    getAddressString: jest.fn()
  };
  const fromAddress = '0xa';
  const gens: any = {};
  gens.gen = cloneableGenerator(handleFromRequest)();
  let random;

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should select getWalletInst', () => {
    expect(gens.gen.next().value).toEqual(select(getWalletInst));
  });

  it('should handle errors as expected', () => {
    gens.clone = gens.gen.clone();
    expect(gens.clone.next(false).value).toEqual(
      put(showNotification('warning', 'Your wallets address could not be fetched'))
    );
    expect(gens.clone.next().value).toEqual(put(getFromFailed()));
    expect(gens.clone.next().done).toEqual(true);
  });

  it('should apply walletInst.getAddress', () => {
    expect(gens.gen.next(walletInst).value).toEqual(apply(walletInst, walletInst.getAddressString));
  });

  it('should put getFromSucceeded', () => {
    expect(gens.gen.next(fromAddress).value).toEqual(put(getFromSucceeded(fromAddress)));
  });
});
