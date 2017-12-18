import { getNodeLib } from 'selectors/config';
import { select, apply, takeEvery } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { SagaIterator } from 'redux-saga';
import { getWalletInst } from 'selectors/wallet';
import { Web3Wallet } from 'libs/wallet';
import { AppState } from 'reducers';
import { broadcastTransactionWrapper } from './helpers';
import { TypeKeys as TK } from 'actions/transaction';

export const broadcastLocalTransactionHandler = function*(signedTx: string): SagaIterator {
  const node: INode = yield select(getNodeLib);
  const txHash = yield apply(node, node.sendRawTx, [signedTx.toString()]);
  return txHash;
};

const broadcastLocalTransaction = broadcastTransactionWrapper(broadcastLocalTransactionHandler);

// web3 transactions are a little different since they do signing + broadcast in 1 step
// meaning we have to grab the tx data and send it
export const broadcastWeb3TransactionHandler = function*(tx: string): SagaIterator {
  //get web3 wallet
  const wallet: AppState['wallet']['inst'] = yield select(getWalletInst);
  if (!wallet || !(wallet instanceof Web3Wallet)) {
    throw Error('Can not broadcast: Web3 wallet not found');
  }

  // sign and broadcast
  const txHash: string = yield apply(wallet, wallet.sendTransaction, [tx]);
  return txHash;
};

const broadcastWeb3Transaction = broadcastTransactionWrapper(broadcastWeb3TransactionHandler);

export const broadcast = [
  takeEvery([TK.BROADCAST_WEB3_TRANSACTION_REQUESTED], broadcastWeb3Transaction),
  takeEvery([TK.BROADCAST_LOCAL_TRANSACTION_REQUESTED], broadcastLocalTransaction)
];
