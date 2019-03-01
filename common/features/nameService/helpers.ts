import { SagaIterator } from 'redux-saga';
import { select, apply, call } from 'redux-saga/effects';
import ethUtil from 'ethereumjs-util';
import { Namicorn } from 'namicorn';
import { INode } from 'libs/nodes/INode';
import ENS from 'libs/nameServices/ens/contracts';
import { IDomainData, NameState, getNameHash, IENSBaseDomainRequest } from 'libs/nameServices/ens';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import { getENSAddresses } from './selectors';

//#region Make & Decode
interface Params {
  to: any;
  data: any;
  decoder: any;
}

export function* makeEthCallAndDecode({ to, data, decoder }: Params): SagaIterator {
  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const result: string = yield apply(node, node.sendCallRequest, [{ data, to }]);
  const decodedResult = yield call(decoder, result);
  return decodedResult;
}
//#endregion Make & Decode

//#region Mode Map
function* nameStateOwned({}, domain: string) {
  const namicorn = new Namicorn({ debug: true, disableMatcher: true });
  namicorn.use(namicorn.middleware.ens({ url: 'https://mainnet.infura.io/mycrypto' }));
  const domainInfo = yield call(namicorn.resolve, domain);
  const ownerAddress = domainInfo.basic.owner;
  const resolvedAddress = domainInfo.resolver.addr;
  return { ownerAddress, resolvedAddress };
}

function* nameStateReveal({ deedAddress }: IDomainData<NameState.Reveal>): SagaIterator {
  const { ownerAddress }: typeof ENS.deed.owner.outputType = yield call(makeEthCallAndDecode, {
    to: deedAddress,
    data: ENS.deed.owner.encodeInput(),
    decoder: ENS.deed.owner.decodeOutput
  });
  return { ownerAddress };
}

interface IModeMap {
  [x: string]: (
    domainData: IDomainData<NameState>,
    nameHash?: string,
    hash?: Buffer
  ) =>
    | {}
    | { ownerAddress: string; resolvedAddress: string }
    | { auctionCloseTime: string; revealBidTime: string };
}

const modeMap: IModeMap = {
  [NameState.Open]: (_: IDomainData<NameState.Open>) => ({}),
  [NameState.Auction]: (_: IDomainData<NameState.Auction>) => ({}),
  [NameState.Owned]: nameStateOwned,
  [NameState.Forbidden]: (_: IDomainData<NameState.Forbidden>) => ({}),
  [NameState.Reveal]: nameStateReveal,
  [NameState.NotYetAvailable]: (_: IDomainData<NameState.NotYetAvailable>) => ({})
};

export function* resolveEthDomainRequest(domain: string): SagaIterator {
  const [label] = domain.split('.');
  const hash = ethUtil.sha3(label);
  const nameHash = getNameHash(domain);
  const ensAddresses = yield select(getENSAddresses);

  const domainData: typeof ENS.auction.entries.outputType = yield call(makeEthCallAndDecode, {
    to: ensAddresses.public.ethAuction,
    data: ENS.auction.entries.encodeInput({ _hash: hash }),
    decoder: ENS.auction.entries.decodeOutput
  });
  const nameStateHandler = modeMap[domainData.mode];
  const result = yield call(nameStateHandler, domainData, domain);

  const returnValue: IENSBaseDomainRequest = {
    name: label,
    ...domainData,
    ...result,
    labelHash: ethUtil.addHexPrefix(hash.toString('hex')),
    nameHash
  };
  return returnValue;
}

export function* resolveDomainRequest(domain: string): SagaIterator {
  const [, tld] = domain.split('.');
  switch (tld) {
    case 'eth':
      return yield call(resolveEthDomainRequest, domain);
    default:
      return {};
  }
}

//#endregion Mode Map
