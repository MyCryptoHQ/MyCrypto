// @flow
import { takeEvery, call, apply, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { resolveDomainFailed, resolveDomainSuccess } from 'actions/ens';
import type { ResolveDomainRequested } from 'actions/ens';
import type { Yield, Return, Next } from 'sagas/types';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { resolveDomainRequest } from 'libs/ens';
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
