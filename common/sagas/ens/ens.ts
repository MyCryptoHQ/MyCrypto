import {
  ResolveDomainRequested,
  resolveDomainFailed,
  resolveDomainSucceeded,
  BidPlaceRequested
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { SagaIterator } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { DomainRequest, IBaseDomainRequest, IRevealDomainRequest, IDomainData } from 'libs/ens';
import { takeEvery, call, put, select, all } from 'redux-saga/effects';
import { showNotification } from 'actions/notifications';
import ENS from 'libs/ens/contracts';
import { resolveDomainRequest } from './modeMap';
import { getCurrentDomainName } from 'selectors/ens';
import { makeEthCallAndDecode } from 'sagas/ens/helpers';
import networkConfigs from 'libs/ens/networkConfigs';
import { AppState } from 'reducers';
import ethUtil from 'ethereumjs-util';
import { setDataField, setValueField } from 'actions/transaction';
import { Data } from 'libs/units';
const { main } = networkConfigs;

function* resolveDomain(action: ResolveDomainRequested): SagaIterator {
  const { domain } = action.payload;
  const node: INode = yield select(getNodeLib);
  try {
    const domainData: DomainRequest = yield call(resolveDomainRequest, domain, node);
    const domainSuccessAction = resolveDomainSucceeded(domain, domainData);
    yield put(domainSuccessAction);
  } catch (e) {
    const domainFailAction = resolveDomainFailed(domain, e);
    yield put(domainFailAction);
    yield put(showNotification('danger', e.message, 5000));
  }
}

function* placeBid({ payload }: BidPlaceRequested): SagaIterator {
  const { bidValue, maskValue, secret } = payload;
  const domainData: AppState['ens']['domainRequests'][string] = yield select(getCurrentDomainName);
  const { data } = domainData;
  if (!data) {
    return -1;
  }
  if (!isRevealType(data)) {
    return -1;
  }

  const { ownerAddress, labelHash } = data;
  const salt = ethUtil.sha3(secret);
  const hash = Buffer.from(labelHash, 'hex');

  const { sealedBid }: typeof ENS.auction.shaBid.outputType = yield call(makeEthCallAndDecode, {
    data: ENS.auction.shaBid.encodeInput({
      hash,
      owner: ownerAddress,
      salt,
      value: bidValue
    }),
    decoder: ENS.auction.shaBid.decodeOutput,
    to: main.public.ethAuction
  });

  const encodedData = ENS.auction.newBid.encodeInput({ sealedBid });
  yield put(setDataField({ raw: encodedData, value: Data(encodedData) }));
  yield put(setValueField({ raw: maskValue.toString(), value: maskValue }));
  return 1;
}

const isRevealType = (domainData: DomainRequest): domainData is IRevealDomainRequest => {
  return !!(domainData as IRevealDomainRequest).ownerAddress;
};

export function* ens(): SagaIterator {
  yield all([
    takeEvery(TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED, resolveDomain),
    takeEvery(TypeKeys.ENS_BID_PLACE_REQUESTED, placeBid)
  ]);
}
