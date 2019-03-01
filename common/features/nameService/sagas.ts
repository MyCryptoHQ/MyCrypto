import { SagaIterator, delay, buffers } from 'redux-saga';
import { call, put, select, all, actionChannel, take, fork, race } from 'redux-saga/effects';

import { INode } from 'libs/nodes/INode';
import { IENSBaseDomainRequest } from 'libs/nameServices/ens';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import { notificationsActions } from 'features/notifications';
import { nameServiceDomainSelectorSelectors } from './domainSelector';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import * as helpers from './helpers';

function* shouldResolveDomain(domain: string) {
  const currentDomainName = yield select(nameServiceDomainSelectorSelectors.getCurrentDomainName);
  if (currentDomainName === domain) {
    const currentDomainData = yield select(selectors.getCurrentDomainData);
    if (currentDomainData) {
      return false;
    }
  }
  return true;
}

function* resolveDomain(): SagaIterator {
  const requestChan = yield actionChannel(
    types.NameServiceActions.RESOLVE_DOMAIN_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const { payload }: types.ResolveDomainRequested = yield take(requestChan);

    const { domain } = payload;

    try {
      const shouldResolve = yield call(shouldResolveDomain, domain);
      if (!shouldResolve) {
        yield put(actions.resolveDomainCached({ domain }));
        continue;
      }

      const node: INode = yield select(configNodesSelectors.getNodeLib);

      const result: { domainData: IENSBaseDomainRequest; error: any } = yield race({
        domainData: call(helpers.resolveDomainRequest, domain, node),
        err: call(delay, 10000)
      });

      const { domainData } = result;

      if (!domainData) {
        throw Error();
      }
      const domainSuccessAction = actions.resolveDomainSucceeded(domain, domainData);
      yield put(domainSuccessAction);
    } catch (e) {
      const domainFailAction = actions.resolveDomainFailed(domain, e);
      yield put(domainFailAction);
      yield put(
        notificationsActions.showNotification(
          'danger',
          e.message || 'Could not resolve ENS address',
          5000
        )
      );
    }
  }
}

export function* nameServiceSaga(): SagaIterator {
  yield all([fork(resolveDomain)]);
}
