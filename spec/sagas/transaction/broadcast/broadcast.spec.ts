import { getNodeLib } from 'selectors/config';
import { select, apply } from 'redux-saga/effects';
import { getWalletInst } from 'selectors/wallet';
import { Web3Wallet } from 'libs/wallet';
import {
  broadcastLocalTransactionHandler,
  broadcastWeb3TransactionHandler
} from 'sagas/transaction/broadcast';
import { cloneableGenerator } from 'redux-saga/utils';

/* tslint:disable */
import 'selectors/transaction'; //throws if not imported
/* tslint:enable */

describe('broadcastLocalTransactionHandler*', () => {
  const signedTx = 'signedTx';
  const node: any = {
    sendRawTx: jest.fn()
  };
  const txHash = 'txHash';

  const gen = broadcastLocalTransactionHandler(signedTx);

  it('should select getNodeLib', () => {
    expect(gen.next().value).toEqual(select(getNodeLib));
  });

  it('should apply node.sendRawTx', () => {
    expect(gen.next(node).value).toEqual(apply(node, node.sendRawTx, [signedTx]));
  });

  it('should return txHash', () => {
    expect(gen.next(txHash).value).toEqual(txHash);
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('broadcastWeb3TransactionHandler*', () => {
  const tx = 'tx';
  const web3Wallet = new Web3Wallet('', '');
  const notWeb3Wallet = false;
  const txHash = 'txHash';

  const gens: any = {};
  gens.gen = cloneableGenerator(broadcastWeb3TransactionHandler)(tx);

  it('should select getWalletInst', () => {
    expect(gens.gen.next().value).toEqual(select(getWalletInst));
  });

  it('should throw if not a web3 wallet', () => {
    gens.clone1 = gens.gen.clone();
    expect(() => gens.clone1.next(notWeb3Wallet)).toThrow();
  });

  it('should apply wallet.sendTransaction', () => {
    expect(gens.gen.next(web3Wallet).value).toEqual(
      apply(web3Wallet, web3Wallet.sendTransaction, [tx])
    );
  });

  it('should return txHash', () => {
    expect(gens.gen.next(txHash).value).toEqual(txHash);
  });

  it('should be done', () => {
    expect(gens.gen.next().done).toEqual(true);
  });
});
