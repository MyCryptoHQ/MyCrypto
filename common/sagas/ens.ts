import {
  ResolveDomainRequested,
  resolveDomainFailed,
  resolveDomainSucceeded
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { SagaIterator } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { resolveDomainRequest, IResolveDomainRequest } from 'libs/ens';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { showNotification } from 'actions/notifications';

function* resolveDomain(action: ResolveDomainRequested): SagaIterator {
  const { domain } = action.payload;
  const node: INode = yield select(getNodeLib);
  try {
    const domainData: IResolveDomainRequest = yield call(
      resolveDomainRequest,
      domain,
      node
    );
    const domainSuccessAction = resolveDomainSucceeded(domain, domainData);
    yield put(domainSuccessAction);
  } catch (e) {
    const domainFailAction = resolveDomainFailed(domain, e);
    yield put(domainFailAction);
    yield put(showNotification('danger', e.message, 5000));
  }
}

export default function* notificationsSaga(): SagaIterator {
  yield takeEvery(TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED, resolveDomain);
}
