import {
  resolveDomainFailed,
  resolveDomainSucceeded,
  ResolveDomainRequested,
  resolveDomainCached,
  ShaBidRequested,
  shaBidSucceeded,
  shaBidFailed
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { SagaIterator, delay, buffers } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { call, put, select, actionChannel, all, take, fork, race } from 'redux-saga/effects';
import { showNotification } from 'actions/notifications';
import { resolveDomainRequest, shaBidRequest } from './modeMap';
import { getCurrentDomainName, getCurrentDomainData } from 'selectors/ens';
import { IBaseDomainRequest } from 'libs/ens';

function* shouldResolveDomain(domain: string) {
  const currentDomainName = yield select(getCurrentDomainName);
  if (currentDomainName === domain) {
    const currentDomainData = yield select(getCurrentDomainData);
    if (currentDomainData) {
      return false;
    }
  }
  return true;
}

function* resolveDomain(): SagaIterator {
  const requestChan = yield actionChannel(
    TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const { payload }: ResolveDomainRequested = yield take(requestChan);

    const { domain } = payload;

    try {
      const shouldResolve = yield call(shouldResolveDomain, domain);
      if (!shouldResolve) {
        yield put(resolveDomainCached({ domain }));
        continue;
      }

      const node: INode = yield select(getNodeLib);

      const result: { domainData: IBaseDomainRequest; error: any } = yield race({
        domainData: call(resolveDomainRequest, domain, node),
        err: call(delay, 10000)
      });

      const { domainData } = result;

      if (!domainData) {
        throw Error();
      }

      const domainSuccessAction = resolveDomainSucceeded(domain, domainData);
      yield put(domainSuccessAction);
    } catch (e) {
      const domainFailAction = resolveDomainFailed(domain, e);
      yield put(domainFailAction);
      yield put(showNotification('danger', e.message || 'Could not resolve ENS address', 5000));
    }
  }
}

function* shaBid(): SagaIterator {
  const requestChan = yield actionChannel(TypeKeys.ENS_SHA_BID_REQUESTED, buffers.sliding(1));

  while (true) {
    const { payload }: ShaBidRequested = yield take(requestChan);

    try {
      const node: INode = yield select(getNodeLib);

      const result = yield race({
        shaBidData: call(shaBidRequest, payload, node),
        err: call(delay, 10000)
      });

      const { shaBidData } = result;

      if (!shaBidData) {
        throw Error();
      }

      const sealedBid = shaBidData.sealedBid.toString('hex');

      yield put(shaBidSucceeded(sealedBid));
    } catch (e) {
      const shaBidFailAction = shaBidFailed('error');
      yield put(shaBidFailAction);
      yield put(showNotification('danger', e.message || 'Could not get SHA Bid', 5000));
    }
  }
}

export function* ens(): SagaIterator {
  yield all([fork(resolveDomain), fork(shaBid)]);
}
