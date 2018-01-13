import {
  resolveDomainFailed,
  resolveDomainSucceeded,
  ResolveDomainRequested,
  resolveDomainCached
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { SagaIterator, delay, buffers } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { call, put, select, all, actionChannel, take, fork, race } from 'redux-saga/effects';
import { showNotification } from 'actions/notifications';
import { resolveDomainRequest } from './modeMap';
import { getCurrentDomainName, getCurrentDomainData } from 'selectors/ens';

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
      const result = yield race({
        domainData: call(resolveDomainRequest, domain, node),
        err: call(delay, 4000)
      });

      const { domainData } = result;
      if (!domainData) {
        throw Error();
      }
      const domainSuccessAction = resolveDomainSucceeded(domain, domainData);
      yield put(domainSuccessAction);
      yield;
    } catch (e) {
      const domainFailAction = resolveDomainFailed(domain, e);
      yield put(domainFailAction);
      yield put(showNotification('danger', e.message || 'Could not resolve ENS address', 5000));
    }
  }
}

export function* ens(): SagaIterator {
  yield all([fork(resolveDomain)]);
}
