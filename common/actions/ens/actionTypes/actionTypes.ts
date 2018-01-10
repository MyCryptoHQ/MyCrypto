import { PlaceBidAction } from './placeBid';
import { ResolveDomainAction } from './resolveDomain';

export * from './placeBid';
export * from './resolveDomain';

export type EnsAction = PlaceBidAction | ResolveDomainAction;
