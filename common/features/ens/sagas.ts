import { SagaIterator, delay, buffers } from 'redux-saga';
import { call, put, select, all, actionChannel, take, fork, race } from 'redux-saga/effects';

import { INode } from 'libs/nodes/INode';
import { IBaseDomainRequest } from 'libs/ens';
import { getNodeLib } from 'features/config/nodes/selectors';
import { showNotification } from 'features/notifications/actions';
import { getCurrentDomainName } from './domainSelector/selectors';
import { ENS, ResolveDomainRequested } from './types';
import { resolveDomainFailed, resolveDomainSucceeded, resolveDomainCached } from './actions';
import { getCurrentDomainData } from './selectors';
import { resolveDomainRequest } from './helpers';

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
  const requestChan = yield actionChannel(ENS.RESOLVE_DOMAIN_REQUESTED, buffers.sliding(1));

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

export function* ensSaga(): SagaIterator {
  yield all([fork(resolveDomain)]);
}
