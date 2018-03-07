import { getNonceSucceeded, inputNonce } from 'actions/transaction';
import { apply, put, select, fork, take, cancel } from 'redux-saga/effects';
import { getNodeLib, getOffline } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { handleNonceRequest, handleNonceRequestWrapper } from 'sagas/transaction/network/nonce';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { TypeKeys as WalletTK } from 'actions/wallet';
import { Nonce } from 'libs/units';

describe('handleNonceRequest*', () => {
  const nodeLib = {
    getTransactionCount: jest.fn()
  };
  const walletInst = {
    getAddressString: jest.fn()
  };
  const offline = false;
  const fromAddress = 'fromAddress';
  const retrievedNonce = '0xa';
  const base10Nonce = Nonce(retrievedNonce);

  const gens: any = {};
  gens.gen = cloneableGenerator(handleNonceRequest)();
  let random: () => number;

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should select getNodeLib', () => {
    expect(gens.gen.next().value).toEqual(select(getNodeLib));
  });

  it('should select getWalletInstance', () => {
    expect(gens.gen.next(nodeLib).value).toEqual(select(getWalletInst));
  });

  it('should exit if being called without a wallet inst', () => {
    gens.noWallet = gens.gen.clone();
    gens.noWallet.next(null); // No wallet inst
    expect(gens.noWallet.next(offline).done).toEqual(true);
  });

  it('should select getOffline', () => {
    expect(gens.gen.next(walletInst).value).toEqual(select(getOffline));
  });

  it('should exit if being called while offline', () => {
    gens.offline = gens.gen.clone();
    expect(gens.offline.next(true).done).toEqual(true);
  });

  it('should apply walletInst.getAddressString', () => {
    expect(gens.gen.next(offline).value).toEqual(apply(walletInst, walletInst.getAddressString));
  });

  it('should apply nodeLib.getTransactionCount', () => {
    expect(gens.gen.next(fromAddress).value).toEqual(
      apply(nodeLib, nodeLib.getTransactionCount, [fromAddress])
    );
  });

  it('should put inputNonce', () => {
    expect(gens.gen.next(retrievedNonce).value).toEqual(put(inputNonce(base10Nonce.toString())));
  });

  it('should put getNonceSucceeded', () => {
    expect(gens.gen.next().value).toEqual(put(getNonceSucceeded(retrievedNonce)));
  });
});

describe('handleNonceRequestWrapper*', () => {
  const gen = handleNonceRequestWrapper();
  const nonceRequest = createMockTask();

  it('should fork handleNonceRequest', () => {
    expect(gen.next().value).toEqual(fork(handleNonceRequest));
  });

  it('should take on WALLET_SET', () => {
    expect(gen.next(nonceRequest).value).toEqual(take(WalletTK.WALLET_SET));
  });

  it('should cancel nonceRequest', () => {
    expect(gen.next().value).toEqual(cancel(nonceRequest));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});
