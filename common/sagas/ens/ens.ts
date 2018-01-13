import {
  resolveDomainFailed,
  resolveDomainSucceeded,
  BidPlaceRequested,
  placeBidSucceeded,
  placeBidFailed,
  ResolveDomainRequested,
  resolveDomainCached
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { getWalletInst } from 'selectors/wallet';
import { SagaIterator, delay, buffers } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import {
  takeEvery,
  call,
  put,
  select,
  all,
  apply,
  actionChannel,
  take,
  fork,
  race
} from 'redux-saga/effects';
import { showNotification } from 'actions/notifications';
import ENS from 'libs/ens/contracts';
import { resolveDomainRequest } from './modeMap';
import { getCurrentDomainName, getCurrentDomainData } from 'selectors/ens';
import { makeEthCallAndDecode } from 'sagas/ens/helpers';
import networkConfigs from 'libs/ens/networkConfigs';
import { AppState } from 'reducers';
import ethUtil from 'ethereumjs-util';
import { setDataField, setValueField } from 'actions/transaction';
import { Data } from 'libs/units';

const { main } = networkConfigs;

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
        err: call(delay, 2000)
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
      yield put(showNotification('danger', e.message, 5000));
    }
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
  yield all([fork(resolveDomain), takeEvery(TypeKeys.ENS_BID_PLACE_REQUESTED, placeBid)]);
}
