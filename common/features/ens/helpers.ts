import { SagaIterator } from 'redux-saga';
import { select, apply, call } from 'redux-saga/effects';
import ethUtil from 'ethereumjs-util';

import { INode } from 'libs/nodes/INode';
import ENS from 'libs/ens/contracts';
import { IDomainData, NameState, getNameHash, IBaseDomainRequest } from 'libs/ens';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import { getENSTLD, getENSAddresses } from './selectors';

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
function* nameStateOwned({ deedAddress }: IDomainData<NameState.Owned>, nameHash: string) {
  const ensAddresses = yield select(getENSAddresses);

  // Return the owner's address, and the resolved address if it exists
  // NOTE: THE DEED OWNER IS NOT THE OWNER
  // CHECK LEGACY.MYCRYPTO.COM FOR THE DIFFERENCE BETWEEN DEED OWNER AND OWNER
  // THIS WILL CAUSE MASS CONFUSION IF WE USE THIS AS THE 'OWNER' FOR MIGRATING TO NEW REGISTRAR
  // - TAYLOR
  const { deedOwnerAddress }: typeof ENS.deed.owner.outputType = yield call(makeEthCallAndDecode, {
    to: deedAddress,
    data: ENS.deed.owner.encodeInput(),
    decoder: ENS.deed.owner.decodeOutput
  });

  const { ownerAddress }: typeof ENS.registry.owner.outputType = yield call(makeEthCallAndDecode, {
    to: ensAddresses.registry,
    data: ENS.registry.resolver.encodeInput({
      node: nameHash
    }),
    decoder: ENS.registry.owner.decodeOutput
  });

  const { resolverAddress }: typeof ENS.registry.resolver.outputType = yield call(
    makeEthCallAndDecode,
    {
      to: ensAddresses.registry,
      decoder: ENS.registry.resolver.decodeOutput,
      data: ENS.registry.resolver.encodeInput({
        node: nameHash
      })
    }
  );

  let resolvedAddress = '0x0';

  if (resolverAddress !== '0x0') {
    const result: typeof ENS.resolver.addr.outputType = yield call(makeEthCallAndDecode, {
      to: resolverAddress,
      data: ENS.resolver.addr.encodeInput({ node: nameHash }),
      decoder: ENS.resolver.addr.decodeOutput
    });

    resolvedAddress = result.ret;
  }

  return { ownerAddress, deedOwnerAddress, resolvedAddress };
}

function* nameStateReveal({ deedAddress }: IDomainData<NameState.Reveal>): SagaIterator {
  const { deedOwnerAddress }: typeof ENS.deed.owner.outputType = yield call(makeEthCallAndDecode, {
    to: deedAddress,
    data: ENS.deed.owner.encodeInput(),
    decoder: ENS.deed.owner.decodeOutput
  });
  return { deedOwnerAddress };
}

interface IModeMap {
  [x: string]: (
    domainData: IDomainData<NameState>,
    nameHash?: string,
    hash?: Buffer
  ) =>
    | {}
    | { deedOwnerAddress: string; resolvedAddress: string }
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

export function* resolveDomainRequest(name: string): SagaIterator {
  const ensAddresses = yield select(getENSAddresses);
  const ensTLD = yield select(getENSTLD);
  const lowercaseName = name.toLowerCase();
  const splitName = lowercaseName.split('.');
  let hash: Buffer;
  const nameHash: string = getNameHash(`${lowercaseName}.${ensTLD}`);

  if (splitName.length === 2) {
    hash = ethUtil.sha3(splitName[1]);
  } else {
    hash = ethUtil.sha3(splitName[0]);
  }
  const domainData: typeof ENS.auction.entries.outputType = yield call(makeEthCallAndDecode, {
    to: ensAddresses.public.ethAuction,
    data: ENS.auction.entries.encodeInput({ _hash: hash }),
    decoder: ENS.auction.entries.decodeOutput
  });
  const nameStateHandler = modeMap[domainData.mode];
  const result = yield call(nameStateHandler, domainData, nameHash);

  const returnValue: IBaseDomainRequest = {
    name,
    ...domainData,
    ...result,
    labelHash: ethUtil.addHexPrefix(hash.toString('hex')),
    nameHash
  };
  return returnValue;
}
//#endregion Mode Map
