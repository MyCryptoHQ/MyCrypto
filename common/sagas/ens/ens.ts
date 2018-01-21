import {
  resolveDomainFailed,
  resolveDomainSucceeded,
  ResolveDomainRequested,
  resolveDomainCached,
  placeBidSucceeded,
  placeBidFailed
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import { SagaIterator, delay, buffers } from 'redux-saga';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import {
  call,
  put,
  select,
  all,
  actionChannel,
  take,
  fork,
  race,
  apply,
  takeEvery
} from 'redux-saga/effects';
import { showNotification } from 'actions/notifications';
import { resolveDomainRequest } from './modeMap';
import {
  getCurrentDomainName,
  getCurrentDomainData,
  getFieldValues,
  FieldValues
} from 'selectors/ens';
import { setDataField, setValueField } from 'actions/transaction';
import { Data } from 'libs/units';
import { makeEthCallAndDecode } from 'sagas/ens/helpers';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import ENS from 'libs/ens/contracts';
import * as ethUtil from 'ethereumjs-util';
import ENSNetworks from 'libs/ens/networkConfigs';
import { fields } from './fields';
import { IBaseDomainRequest } from 'libs/ens';

const { main } = ENSNetworks;
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

      const result: { domainData: IBaseDomainRequest; error } = yield race({
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

function* placeBid(): SagaIterator {
  const { bidMask, bidValue, secretPhrase }: FieldValues = yield select(getFieldValues);
  const domainData: AppState['ens']['domainRequests'][string] = yield select(getCurrentDomainName);
  const { data } = domainData;

  if (!(bidMask && bidValue && secretPhrase && data)) {
    yield put(placeBidFailed());
    return -1;
  }

  const { labelHash } = data;
  const salt = ethUtil.sha3(secretPhrase);
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
    yield put(setValueField({ raw: bidMask.toString(), value: bidMask }));
    yield put(placeBidSucceeded());
    return 1;
  } catch {
    yield put(placeBidFailed());
    return -1;
  }
}

export function* ens(): SagaIterator {
  yield all([
    fork(resolveDomain),
    takeEvery(TypeKeys.ENS_BID_PLACE_REQUESTED, placeBid),
    ...fields
  ]);
}
