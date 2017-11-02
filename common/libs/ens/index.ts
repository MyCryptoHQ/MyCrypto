import uts46 from 'idna-uts46';
import ethUtil from 'ethereumjs-util';
import ENS from './contracts';
import networkConfigs from './networkConfigs';
import { INode } from 'libs/nodes/INode';
import Contract, { ISetConfigForTx } from 'libs/contracts';
import { randomBytes } from 'crypto';
import BN from 'bn.js';
const { main } = networkConfigs;

//just set to main network for now
ENS.auction.at(main.public.ethAuction);
ENS.registry.at(main.registry);

export function normalise(name: string) {
  try {
    return uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
  } catch (e) {
    throw e;
  }
}

export const getNameHash = (name: string = ''): string => {
  if (name === '') {
    throw new Error('Empty string provided');
  }

  const normalizedName = normalise(name);
  const sha3 = ethUtil.sha3;
  const labels = normalizedName.split('.');
  const emptyNode = Buffer.alloc(32);
  const rawNode = labels.reduceRight((node, currentLabel) => {
    return sha3(Buffer.concat([node, sha3(currentLabel)]));
  }, emptyNode);

  return `0x${rawNode.toString('hex')}`;
};

const setNodes = node => {
  ENS.auction.setNode(node);
  ENS.deed.setNode(node);
  ENS.resolver.setNode(node);
  ENS.registry.setNode(node);
};

export interface IBaseDomainRequest {
  name: string;
  labelHash: string;
  mode: NameState;
  highestBid: string;
  value: string;
  deedAddress: string;
  registrationDate: string;
  nameHash: string;
  mappedMode: string;
}

export interface IOwnedDomainRequest extends IBaseDomainRequest {
  ownerAddress: string;
  resolvedAddress: string;
}

export interface IRevealDomainRequest extends IBaseDomainRequest {
  ownerAddress: string;
}

export type DomainRequest =
  | IOwnedDomainRequest
  | IRevealDomainRequest
  | IBaseDomainRequest;

interface IDomainData<Mode> {
  mode: Mode;
  deedAddress: string;
  registrationDate: string;
  value: string;
  highestBid: string;
}

export enum NameState {
  Open = '0',
  Auction = '1',
  Owned = '2',
  Forbidden = '3',
  Reveal = '4',
  NotYetAvailable = '5'
}

const modeStrMap = name => [
  `${name} is available and the auction hasn’t started`,
  `${name} is available and the auction has been started`,
  `${name} is taken and currently owned by someone`,
  `${name} is forbidden`,
  `${name} is currently in the ‘reveal’ stage of the auction`,
  `${name} is not yet available due to the ‘soft launch’ of names.`
];

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

export const placeBid = async (
  config: ISetConfigForTx,
  { labelHash, ownerAddress }: IRevealDomainRequest,
  bidValue: BN,
  sendValue: BN,
  gasLimit: BN
) => {
  Contract.setConfigForTx(ENS.auction, config);
  const secret = randomBytes(32).toString();
  const sealedBid = await ENS.auction.shaBid.call({
    hash: Buffer.from(labelHash, 'hex'),
    owner: ownerAddress,
    value: bidValue,
    salt: ethUtil.sha3(secret)
  });

  return {
    ...await ENS.auction.newBid.send({
      input: { sealedBid },
      value: sendValue.toString(),
      gasLimit: gasLimit as any //TODO: fix this when BN gets merged
    }),
    sealedBid
  };
};

export const unsealBid = async (
  config: ISetConfigForTx,
  { labelHash }: IRevealDomainRequest,
  value: BN,
  salt: string,
  gasLimit: BN
) => {
  Contract.setConfigForTx(ENS.auction, config);
  const sendParams = {
    input: { _hash: Buffer.from(labelHash, 'hex'), _value: value, _salt: salt },
    value: '0',
    gasLimit: gasLimit as any //TODO: fix this when BN gets merged
  };

  return ENS.auction.unsealBid.send(sendParams);
};

const modeMap: IModeMap = {
  [NameState.Open]: (_: IDomainData<NameState.Open>) => ({}),
  [NameState.Auction]: (_: IDomainData<NameState.Auction>) => ({}),
  [NameState.Owned]: async (
    // Return the owner's address, and the resolved address if it exists
    { deedAddress }: IDomainData<NameState.Owned>,
    nameHash: string,
    hash: Buffer
  ) => {
    const { ownerAddress } = await ENS.deed.at(deedAddress).owner.call();
    const { resolverAddress } = await ENS.registry.resolver.call({
      node: nameHash
    });

    let resolvedAddress = '0x0';

    if (resolverAddress !== '0x0') {
      const { ret } = await ENS.resolver
        .at(resolverAddress)
        .addr.call({ node: hash });
      resolvedAddress = ret;
    }

    return { ownerAddress, resolvedAddress };
  },
  [NameState.Forbidden]: (_: IDomainData<NameState.Forbidden>) => ({}),
  [NameState.Reveal]: async ({
    deedAddress
  }: IDomainData<NameState.Reveal>) => ({
    ownerAddress: await ENS.deed.at(deedAddress).owner.call()
  }),
  [NameState.NotYetAvailable]: (
    _: IDomainData<NameState.NotYetAvailable>
  ) => ({})
};

export const resolveDomainRequest = async (
  name: string,
  node: INode
): Promise<DomainRequest> => {
  setNodes(node);
  const hash = ethUtil.sha3(name);
  const nameHash = getNameHash(`${name}.eth`);
  const domainData = await ENS.auction.entries.call({ _hash: hash });
  const result = await modeMap[domainData.mode](domainData, nameHash, hash);

  return {
    name,
    ...domainData,
    ...result,
    labelHash: hash.toString('hex'),
    nameHash,
    mappedMode: modeStrMap(`${name}.eth`)[domainData.mode]
  };
};
