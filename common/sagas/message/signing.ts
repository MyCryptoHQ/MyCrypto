import { SagaIterator } from 'redux-saga';
import { put, take, apply, takeEvery, call, select } from 'redux-saga/effects';
import translate from 'translations';
import { showNotification } from 'actions/notifications';
import {
  TypeKeys,
  signLocalMessageSucceeded,
  SignLocalMessageSucceededAction,
  SignMessageRequestedAction
} from 'actions/message';
import {
  requestMessageSignature,
  FinalizeSignatureAction,
  TypeKeys as ParityKeys
} from 'actions/paritySigner';
import { IFullWallet } from 'libs/wallet';
import { getWalletType, IWalletType } from 'selectors/wallet';
import { messageToData, signingWrapper } from './helpers';

function* signLocalMessage(wallet: IFullWallet, msg: string): SagaIterator {
  const address = yield apply(wallet, wallet.getAddressString);
  const sig: string = yield apply(wallet, wallet.signMessage, [msg]);

  yield put(
    signLocalMessageSucceeded({
      address,
      msg,
      sig,
      version: '2'
    })
  );
}

function* signParitySignerMessage(wallet: IFullWallet, msg: string): SagaIterator {
  const address = yield apply(wallet, wallet.getAddressString);
  const data = yield call(messageToData, msg);

  yield put(requestMessageSignature(address, data));

  const { payload: sig }: FinalizeSignatureAction = yield take(
    ParityKeys.PARITY_SIGNER_FINALIZE_SIGNATURE
  );

  if (!sig) {
    throw new Error('Missing signature!');
  }

  yield put(
    signLocalMessageSucceeded({
      address,
      msg,
      sig,
      version: '2'
    })
  );
}

function* handleMessageRequest(action: SignMessageRequestedAction): SagaIterator {
  const walletType: IWalletType = yield select(getWalletType);

  const signingHandler = walletType.isParitySignerWallet
    ? signParitySignerMessage
    : signLocalMessage;

  return yield call(signingWrapper, signingHandler, action);
}

function* notifySuccess(action: SignLocalMessageSucceededAction): SagaIterator {
  yield put(
    showNotification('success', translate('SIGN_MSG_SUCCESS', { $address: action.payload.address }))
  );
}

export const signing = [
  takeEvery(TypeKeys.SIGN_MESSAGE_REQUESTED, handleMessageRequest),
  takeEvery(TypeKeys.SIGN_LOCAL_MESSAGE_SUCCEEDED, notifySuccess)
  // TODO:
  // takeEvery(TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED, verifySignature)
];
