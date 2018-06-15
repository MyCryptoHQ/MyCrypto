import { SagaIterator } from 'redux-saga';
import { put, take, all, apply, takeEvery, call, select } from 'redux-saga/effects';

import translate, { translateRaw } from 'translations';
import { verifySignedMessage } from 'libs/signing';
import { IFullWallet } from 'libs/wallet';
import { padLeftEven } from 'libs/values';
import Web3Node from 'libs/nodes/web3';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as notificationsActions from 'features/notifications/actions';
import * as paritySignerTypes from 'features/paritySigner/types';
import * as paritySignerActions from 'features/paritySigner/actions';
import * as walletSelectors from 'features/wallet/selectors';
import * as messageTypes from './types';
import * as messageActions from './actions';

export function* signingWrapper(
  handler: (wallet: IFullWallet, message: string) => SagaIterator,
  action: messageTypes.SignMessageRequestedAction
): SagaIterator {
  const payloadMessage = action.payload;
  const wallet = yield select(walletSelectors.getWalletInst);

  try {
    yield call(handler, wallet, payloadMessage);
  } catch (err) {
    yield put(
      notificationsActions.showNotification(
        'danger',
        translate('SIGN_MSG_FAIL', { $err: err.message }),
        5000
      )
    );
    yield put(messageActions.signMessageFailed());
  }
}

export function messageToData(messageToTransform: string): string {
  return (
    '0x' +
    Array.from(Buffer.from(messageToTransform, 'utf8'))
      .map(n => padLeftEven(n.toString(16)))
      .join('')
  );
}

function* signLocalMessage(wallet: IFullWallet, msg: string): SagaIterator {
  const address = yield apply(wallet, wallet.getAddressString);
  const nodeLib: Web3Node = yield select(configNodesSelectors.getNodeLib);
  const sig: string = yield apply(wallet, wallet.signMessage, [msg, nodeLib]);

  yield put(
    messageActions.signLocalMessageSucceeded({
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

  yield put(paritySignerActions.requestMessageSignature(address, data));

  const { payload: sig }: paritySignerTypes.FinalizeSignatureAction = yield take(
    paritySignerTypes.PARITY_SIGNER.FINALIZE_SIGNATURE
  );

  if (!sig) {
    throw new Error(translateRaw('ERROR_38'));
  }

  yield put(
    messageActions.signLocalMessageSucceeded({
      address,
      msg,
      sig,
      version: '2'
    })
  );
}

function* handleMessageRequest(action: messageTypes.SignMessageRequestedAction): SagaIterator {
  const walletType: walletSelectors.IWalletType = yield select(walletSelectors.getWalletType);

  const signingHandler = walletType.isParitySignerWallet
    ? signParitySignerMessage
    : signLocalMessage;

  return yield call(signingWrapper, signingHandler, action);
}

function* verifySignature(action: messageTypes.SignLocalMessageSucceededAction): SagaIterator {
  const success = yield call(verifySignedMessage, action.payload);

  if (success) {
    yield put(
      notificationsActions.showNotification(
        'success',
        translate('SIGN_MSG_SUCCESS', { $address: action.payload.address })
      )
    );
  } else {
    yield put(messageActions.signMessageFailed());
    yield put(notificationsActions.showNotification('danger', translate('ERROR_38')));
  }
}

export const signing = [
  takeEvery(messageTypes.MessageActions.SIGN_REQUESTED, handleMessageRequest),
  takeEvery(messageTypes.MessageActions.SIGN_LOCAL_SUCCEEDED, verifySignature)
];

export function* messageSaga(): SagaIterator {
  yield all([...signing]);
}
