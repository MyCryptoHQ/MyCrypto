import uts46 from 'idna-uts46';
import ethUtil from 'ethereumjs-util';

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

export type DomainRequest = IOwnedDomainRequest | IRevealDomainRequest | IBaseDomainRequest;

export interface IDomainData<Mode> {
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

export const modeStrMap = name => [
  `${name} is available and the auction hasn’t started`,
  `${name} is available and the auction has been started`,
  `${name} is taken and currently owned by someone`,
  `${name} is forbidden`,
  `${name} is currently in the ‘reveal’ stage of the auction`,
  `${name} is not yet available due to the ‘soft launch’ of names.`
];

export interface IModeMap {
  [x: string]: (
    domainData: IDomainData<NameState>,
    nameHash?: string,
    hash?: Buffer
  ) =>
    | {}
    | { ownerAddress: string; resolvedAddress: string }
    | { auctionCloseTime: string; revealBidTime: string };
}
