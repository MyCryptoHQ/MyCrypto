import { PlaceBidAction } from './placeBid';
import { ResolveDomainAction } from './resolveDomain';

export * from './placeBid';
export * from './resolveDomain';
export * from './fields';

export type EnsAction = PlaceBidAction | ResolveDomainAction;
