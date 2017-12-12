import { getNonceSucceeded, getNonceFailed, TypeKeys as TK, inputNonce } from 'actions/transaction';
import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';
import { getNodeLib } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { showNotification } from 'actions/notifications';

import { handleNonceRequest } from 'sagas/transaction/network/nonce';
import { cloneableGenerator } from 'redux-saga/utils';

describe('handleNonceRequest*', () => {
  const nodeLib = {
    getTransactionCount: jest.fn()
  };
  const walletInst = {
    getAddressString: jest.fn()
  };
  const fromAddress = 'fromAddress';
  const retrievedNonce = 'retrievedNonce';

  const gens: any = {};
  gens.gen = cloneableGenerator(handleNonceRequest)();
  let random;

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

  it('should handle errors correctly', () => {
    gens.clone = gens.gen.clone();
    expect(gens.clone.next().value).toEqual(
      put(showNotification('warning', 'Your addresses nonce could not be fetched'))
    );
    expect(gens.clone.next().value).toEqual(put(getNonceFailed()));
    expect(gens.clone.next().done).toEqual(true);
  });

  it('should apply walletInst.getAddressString', () => {
    expect(gens.gen.next(walletInst).value).toEqual(apply(walletInst, walletInst.getAddressString));
  });

  it('should apply nodeLib.getTransactionCount', () => {
    expect(gens.gen.next(fromAddress).value).toEqual(
      apply(nodeLib, nodeLib.getTransactionCount, [fromAddress])
    );
  });

  it('should put inputNonce', () => {
    expect(gens.gen.next(retrievedNonce).value).toEqual(put(inputNonce(retrievedNonce)));
  });

  it('should put getNonceSucceeded', () => {
    expect(gens.gen.next().value).toEqual(put(getNonceSucceeded(retrievedNonce)));
  });
});
