import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import translate from 'translations';
import { padLeftEven } from 'libs/values';
import { showNotification } from 'actions/notifications';
import { getWalletInst } from 'selectors/wallet';
import { IFullWallet } from 'libs/wallet';
import { signMessageFailed, SignMessageRequestedAction } from 'actions/message';

export function* signingWrapper(
  handler: (wallet: IFullWallet, message: string) => SagaIterator,
  action: SignMessageRequestedAction
): SagaIterator {
  const message = action.payload;
  const wallet = yield select(getWalletInst);

  try {
    yield call(handler, wallet, message);
  } catch (err) {
    yield put(showNotification('danger', translate('SIGN_MSG_FAIL', { $err: err.message }), 5000));
    yield put(signMessageFailed());
  }
}

/**
 * Turns a string into hex-encoded UTF-8 byte array, `0x` prefixed.
 *
 * @param  {string} message to encode
 * @return {string}
 */
export function messageToData(message: string): string {
  return (
    '0x' +
    Array.from(Buffer.from(message, 'utf8'))
      .map(n => padLeftEven(n.toString(16)))
      .join('')
  );
}
