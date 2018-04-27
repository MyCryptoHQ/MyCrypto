import { isEtherTransaction } from 'selectors/transaction';
import { SetCurrentToAction } from 'actions/transaction/actionTypes/current';
import { setToField } from 'actions/transaction/actionCreators/fields';
import { setTokenTo } from 'actions/transaction/actionCreators/meta';
import { Address } from 'libs/units';
import { select, call, put, takeLatest, take } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { isValidENSAddress, isValidAddress } from 'libs/validators';
import { TypeKeys } from 'actions/transaction/constants';
import { getResolvedAddress } from 'selectors/ens';
import { resolveDomainRequested, TypeKeys as ENSTypekeys } from 'actions/ens';
import { SetToFieldAction, SetTokenToMetaAction } from 'actions/transaction';
import { NetworkConfig } from 'types/network';
import { getNetworkConfig } from 'selectors/config';

export function* setCurrentTo({ payload: raw }: SetCurrentToAction): SagaIterator {
  const network: NetworkConfig = yield select(getNetworkConfig);
  const validAddress: boolean = yield call(isValidAddress, raw, network.chainId);
  const validEns: boolean = yield call(isValidENSAddress, raw);

  let value: Buffer | null = null;
  if (validAddress) {
    value = Address(raw);
  } else if (validEns) {
    yield call(setField, { value, raw });

    const [domain] = raw.split('.');
    yield put(resolveDomainRequested(domain));
    yield take([
      ENSTypekeys.ENS_RESOLVE_DOMAIN_FAILED,
      ENSTypekeys.ENS_RESOLVE_DOMAIN_SUCCEEDED,
      ENSTypekeys.ENS_RESOLVE_DOMAIN_CACHED
    ]);
    const resolvedAddress: string | null = yield select(getResolvedAddress, true);
    if (resolvedAddress) {
      value = Address(resolvedAddress);
    }
  }

  yield call(setField, { value, raw });
}

export function* setField(payload: SetToFieldAction['payload'] | SetTokenToMetaAction['payload']) {
  const etherTransaction: boolean = yield select(isEtherTransaction);

  if (etherTransaction) {
    yield put(setToField(payload));
  } else {
    yield put(setTokenTo(payload));
  }
}

export const currentTo = takeLatest([TypeKeys.CURRENT_TO_SET], setCurrentTo);
