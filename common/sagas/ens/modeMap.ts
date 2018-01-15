import { IDomainData, NameState, getNameHash } from 'libs/ens';
import ENS from 'libs/ens/contracts';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import networkConfigs from 'libs/ens/networkConfigs';
import { makeEthCallAndDecode } from 'sagas/ens/helpers';
import ethUtil from 'ethereumjs-util';

const { main } = networkConfigs;

function* nameStateOwned({ deedAddress }: IDomainData<NameState.Owned>, nameHash: string) {
  // Return the owner's address, and the resolved address if it exists
  const { ownerAddress }: typeof ENS.deed.owner.outputType = yield call(makeEthCallAndDecode, {
    to: deedAddress,
    data: ENS.deed.owner.encodeInput(),
    decoder: ENS.deed.owner.decodeOutput
  });

  const { resolverAddress }: typeof ENS.registry.resolver.outputType = yield call(
    makeEthCallAndDecode,
    {
      to: main.registry,
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

  return { ownerAddress, resolvedAddress };
}

function* nameStateReveal({ deedAddress }: IDomainData<NameState.Reveal>): SagaIterator {
  const { ownerAddress }: typeof ENS.deed.owner.outputType = yield call(makeEthCallAndDecode, {
    to: deedAddress,
    data: ENS.deed.owner.encodeInput(),
    decoder: ENS.deed.owner.decodeOutput
  });
  return ownerAddress;
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

export function* resolveDomainRequest(name: string): SagaIterator {
  const hash = ethUtil.sha3(name);
  const nameHash = getNameHash(`${name}.eth`);

  const domainData: typeof ENS.auction.entries.outputType = yield call(makeEthCallAndDecode, {
    to: main.public.ethAuction,
    data: ENS.auction.entries.encodeInput({ _hash: hash }),
    decoder: ENS.auction.entries.decodeOutput
  });
  const nameStateHandler = modeMap[domainData.mode];
  const result = yield call(nameStateHandler, domainData, nameHash);

  return {
    name,
    ...domainData,
    ...result,
    labelHash: hash.toString('hex'),
    nameHash
  };
}
