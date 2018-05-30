import { ResolveDomainAction } from './resolveDomain';
import { ShaBidAction } from './shaBid';

export * from './resolveDomain';
export * from './shaBid';

export type EnsAction = ResolveDomainAction | ShaBidAction;
