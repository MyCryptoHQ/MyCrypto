import { SagaIterator } from 'redux-saga';
import { apply, put, select, take, call, takeEvery } from 'redux-saga/effects';
import Tx from 'ethereumjs-tx';

import { computeIndexingHash } from 'libs/transaction';
import { IFullWallet } from 'libs/wallet';
import { StaticNetworkConfig } from 'types/network';
import { transactionToRLP, signTransactionWithSignature } from 'utils/helpers';
import * as derivedSelectors from 'features/selectors';
import { getNetworkConfig } from 'features/config/selectors';
import { paritySignerTypes, paritySignerActions } from 'features/paritySigner';
import { walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsActions } from '../fields';
import { transactionNetworkTypes, transactionNetworkActions } from '../network';
import * as types from './types';
import * as actions from './actions';

//#region Signing
export interface IFullWalletAndTransaction {
  wallet: IFullWallet;
  tx: Tx;
}

export const signTransactionWrapper = (
  func: (IWalletAndTx: IFullWalletAndTransaction) => SagaIterator
) =>
  function*(partialTx: types.SignTransactionRequestedAction) {
    try {
      const IWalletAndTx: IFullWalletAndTransaction = yield call(
        getWalletAndTransaction,
        partialTx.payload
      );
      yield call(getFromSaga);
      yield call(func, IWalletAndTx);
    } catch (err) {
      yield call(handleFailedTransaction, err);
    }
  };

/**
 * @description grabs wallet and required tx parameters via selectors, and assigns
 * the rest of the tx parameters from the action
 * @param partialTx
 */
export function* getWalletAndTransaction(
  partialTx: types.SignTransactionRequestedAction['payload']
): SagaIterator {
  // get the wallet we're going to sign with
  const wallet: null | IFullWallet = yield select(walletSelectors.getWalletInst);
  if (!wallet) {
    throw Error('Could not get wallet instance to sign transaction');
  }
  // get the chainId
  const { chainId }: StaticNetworkConfig = yield select(getNetworkConfig);

  // get the rest of the transaction parameters
  partialTx._chainId = chainId;
  return {
    wallet,
    tx: partialTx
  };
}

export function* handleFailedTransaction(err: Error): SagaIterator {
  yield put(notificationsActions.showNotification('danger', err.message, 5000));
  yield put(actions.signTransactionFailed());
}

export function* getFromSaga(): SagaIterator {
  yield put(transactionNetworkActions.getFromRequested());
  // wait for it to finish
  const {
    type
  }:
    | transactionNetworkTypes.GetFromFailedAction
    | transactionNetworkTypes.GetFromSucceededAction = yield take([
    transactionNetworkTypes.TransactionNetworkActions.GET_FROM_SUCCEEDED,
    transactionNetworkTypes.TransactionNetworkActions.GET_FROM_FAILED
  ]);
  // continue if it doesnt fail
  if (type === transactionNetworkTypes.TransactionNetworkActions.GET_FROM_FAILED) {
    throw Error('Could not get "from" address of wallet');
  }
}
//#endregion Signing

//#region Signing
export function* signLocalTransactionHandler({
  tx,
  wallet
}: IFullWalletAndTransaction): SagaIterator {
  const signedTransaction: Buffer = yield apply(wallet, wallet.signRawTransaction, [tx]);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);
  yield put(
    actions.signLocalTransactionSucceeded({
      signedTransaction,
      indexingHash,
      noVerify: false
    })
  );
}

const signLocalTransaction = signTransactionWrapper(signLocalTransactionHandler);

export function* signWeb3TransactionHandler({ tx }: IFullWalletAndTransaction): SagaIterator {
  const serializedTransaction: Buffer = yield apply(tx, tx.serialize);
  const indexingHash: string = yield call(computeIndexingHash, serializedTransaction);

  yield put(
    actions.signWeb3TransactionSucceeded({
      transaction: serializedTransaction,
      indexingHash
    })
  );
}

const signWeb3Transaction = signTransactionWrapper(signWeb3TransactionHandler);

export function* signParitySignerTransactionHandler({
  tx,
  wallet
}: IFullWalletAndTransaction): SagaIterator {
  const from = yield apply(wallet, wallet.getAddressString);
  const rlp = yield call(transactionToRLP, tx);

  yield put(paritySignerActions.requestTransactionSignature(from, rlp));

  const { payload }: paritySignerTypes.FinalizeSignatureAction = yield take(
    paritySignerTypes.ParitySignerActions.FINALIZE_SIGNATURE
  );
  const signedTransaction: Buffer = yield call(signTransactionWithSignature, tx, payload);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);

  yield put(
    actions.signLocalTransactionSucceeded({
      signedTransaction,
      indexingHash,
      noVerify: false
    })
  );
}

const signParitySignerTransaction = signTransactionWrapper(signParitySignerTransactionHandler);

/**
 * @description Verifies that the transaction matches the fields, and if its a locally signed transaction (so it has a signature) it will verify the signature too
 * @param {(SignWeb3TransactionSucceededAction | SignLocalTransactionSucceededAction)} {
 *   type
 * }
 * @returns {SagaIterator}
 */
function* verifyTransaction({
  type,
  payload: { noVerify }
}:
  | types.SignWeb3TransactionSucceededAction
  | types.SignLocalTransactionSucceededAction): SagaIterator {
  if (noVerify) {
    return;
  }
  const transactionsMatch: boolean = yield select(
    derivedSelectors.serializedAndTransactionFieldsMatch,
    type === types.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
    noVerify
  );
  if (!transactionsMatch) {
    yield put(
      notificationsActions.showNotification(
        'danger',
        'Something went wrong signing your transaction, please try again'
      )
    );
    yield put(transactionFieldsActions.resetTransactionRequested());
  }
}

function* handleTransactionRequest(action: types.SignTransactionRequestedAction): SagaIterator {
  const walletType: walletSelectors.IWalletType = yield select(walletSelectors.getWalletType);

  const signingHandler = walletType.isWeb3Wallet
    ? signWeb3Transaction
    : walletType.isParitySignerWallet ? signParitySignerTransaction : signLocalTransaction;

  return yield call(signingHandler, action);
}

export const signing = [
  takeEvery(types.TransactionSignActions.SIGN_TRANSACTION_REQUESTED, handleTransactionRequest),
  takeEvery(
    [
      types.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      types.TransactionSignActions.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ],
    verifyTransaction
  )
];
//#endregion Signing
