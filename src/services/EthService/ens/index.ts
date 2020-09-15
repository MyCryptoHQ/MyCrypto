import { keccak } from 'ethereumjs-util';

import { normalize } from '../utils';

export const getNameHash = (name: string = ''): string => {
  if (name === '') {
    throw new Error('Empty string provided');
  }

  const normalizedName = normalize(name);
  const labels = normalizedName.split('.');
  const emptyNode = Buffer.alloc(32);
  const rawNode = labels.reduceRight((node, currentLabel) => {
    return keccak(Buffer.concat([node, keccak(currentLabel)]));
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
  deedOwnerAddress: string;
  resolvedAddress: string;
}

export interface IRevealDomainRequest extends IBaseDomainRequest {
  deedOwnerAddress: string;
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

export const modeStrMap = (name: string) => [
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

export * from './validators';
export { getResolvedENSAddress } from './ensFunctions';
