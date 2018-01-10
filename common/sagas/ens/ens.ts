import {
  ResolveDomainRequested,
  resolveDomainFailed,
  resolveDomainSucceeded,
  BidPlaceRequested,
  placeBidSucceeded,
  placeBidFailed
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { getWalletInst } from 'selectors/wallet';
import { SagaIterator } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { DomainRequest } from 'libs/ens';
import { takeEvery, call, put, select, all, apply } from 'redux-saga/effects';
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
    yield put(placeBidFailed());
    return -1;
  }

  const { labelHash } = data;
  const salt = ethUtil.sha3(secret);
  const hash = Buffer.from(labelHash, 'hex');

  try {
    const walletInst: AppState['wallet']['inst'] = yield select(getWalletInst);
    if (!walletInst) {
      throw Error('No wallet instance found');
    }

    const owner = yield apply(walletInst, walletInst.getAddressString);

    const { sealedBid }: typeof ENS.auction.shaBid.outputType = yield call(makeEthCallAndDecode, {
      data: ENS.auction.shaBid.encodeInput({
        hash,
        owner,
        salt,
        value: bidValue
      }),
      decoder: ENS.auction.shaBid.decodeOutput,
      to: main.public.ethAuction
    });

    const encodedData = ENS.auction.newBid.encodeInput({ sealedBid });
    yield put(setDataField({ raw: encodedData, value: Data(encodedData) }));
    yield put(setValueField({ raw: maskValue.toString(), value: maskValue }));
    yield put(placeBidSucceeded());
    return 1;
  } catch {
    yield put(placeBidFailed());
    return -1;
  }
}

export function* ens(): SagaIterator {
  yield all([
    takeEvery(TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED, resolveDomain),
    takeEvery(TypeKeys.ENS_BID_PLACE_REQUESTED, placeBid)
  ]);
}
