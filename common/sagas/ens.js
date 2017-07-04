// @flow
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { cacheEnsAddress } from 'actions/ens';
import type { ResolveEnsNameAction } from 'actions/ens';
import { getEnsAddress } from 'selectors/ens';
import { donationAddressMap } from 'config/data';

function* resolveEns(action: ResolveEnsNameAction) {
  const ensName = action.payload;
  // FIXME Add resolve logic
  ////                     _ens.getAddress(scope.addressDrtv.ensAddressField, function(data) {
  //                         if (data.error) uiFuncs.notifier.danger(data.msg);
  //                         else if (data.data == '0x0000000000000000000000000000000000000000' || data.data == '0x') {
  //                             setValue('0x0000000000000000000000000000000000000000');
  //                             scope.addressDrtv.derivedAddress = '0x0000000000000000000000000000000000000000';
  //                             scope.addressDrtv.showDerivedAddress = true;
  //                         } else {
  //                             setValue(data.data);
  //                             scope.addressDrtv.derivedAddress = ethUtil.toChecksumAddress(data.data);
  //                             scope.addressDrtv.showDerivedAddress = true;

  const cachedEnsAddress = yield select(getEnsAddress, ensName);

  if (cachedEnsAddress) {
    return;
  }
  yield call(delay, 1000);
  yield put(cacheEnsAddress(ensName, donationAddressMap.ETH));
}

export default function* notificationsSaga() {
  yield takeEvery('ENS_RESOLVE', resolveEns);
}
