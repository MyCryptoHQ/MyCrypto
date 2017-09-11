// @flow
import type { ResolveDomainRequested } from 'actions/ens';
import type { Next, Return, Yield } from 'sagas/types';
import type { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { resolveDomainFailed, resolveDomainSuccess } from 'actions/ens';
import { resolveDomainRequest } from 'libs/ens';
import { takeEvery, call, put, select } from 'redux-saga/effects';

function* resolveDomain(
  action: ResolveDomainRequested
): Generator<Yield, Return, Next> {
  const { domain } = action.payload;
  const node: INode = yield select(getNodeLib);
  try {
    const domainData = yield call(resolveDomainRequest, domain, node);
    const domainSuccessAction = resolveDomainSuccess(domain, domainData);
    yield put(domainSuccessAction);
  } catch (e) {
    const domainFailAction = resolveDomainFailed(domain, e);
    yield put(domainFailAction);
  }
}

export default function* notificationsSaga(): Generator<Yield, Return, Next> {
  yield takeEvery('ENS_RESOLVE_DOMAIN_REQUESTED', resolveDomain);
}
