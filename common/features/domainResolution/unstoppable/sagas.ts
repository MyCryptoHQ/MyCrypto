import { SagaIterator, buffers } from 'redux-saga';
import { call, put, select, all, actionChannel, take, fork } from 'redux-saga/effects';
import { NameState } from 'libs/ens';
import { notificationsActions } from 'features/notifications';
import { unstoppableDomainSelectorSelectors } from './domainSelector';
import * as types from '../common/types';
import * as actions from '../common/actions';
import * as selectors from './selectors';
import UnstoppableResolution from 'v2/services/UnstoppableResolution';

function* shouldResolveDomain(domain: string) {
  const currentDomainName = yield select(unstoppableDomainSelectorSelectors.getCurrentDomainName);
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
    types.UnstoppableActions.UNSTOPPABLE_DOMAIN_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const { payload }: types.ResolveDomainRequested = yield take(requestChan);

    const { domain } = payload;

    try {
      const shouldResolve = yield call(shouldResolveDomain, domain);
      if (!shouldResolve) {
        yield put(actions.resolveDomainCached({ domain }, true));
        continue;
      }
      const resolutionTool = new UnstoppableResolution();
      const resolvedAddress: string = yield call(resolutionTool.getResolvedAddress, domain, 'ETH');
      const domainSuccessAction = actions.resolveDomainSucceeded(
        domain,
        {
          name: domain,
          labelHash: '',
          mode: NameState.Reveal,
          highestBid: '',
          value: resolvedAddress,
          deedAddress: '',
          registrationDate: '',
          nameHash: '',
          mappedMode: '',
          resolvedAddress
        },
        true
      );
      yield put(domainSuccessAction);
    } catch (e) {
      const domainFailAction = actions.resolveDomainFailed(domain, e, true);
      yield put(domainFailAction);
      yield put(
        notificationsActions.showNotification(
          'danger',
          e.message || `Could not resolve ${domain} address`,
          5000
        )
      );
    }
  }
}

export function* unstoppableSaga(): SagaIterator {
  yield all([fork(resolveDomain)]);
}
