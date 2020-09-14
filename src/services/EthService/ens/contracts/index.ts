import { Contract } from '@services';
import auctionABI from './auction/auction.json';
import auctionOutputMappings from './auction/outputMappings';
import { IAuction } from './auction/auction';

import deedABI from './auction/deed.json';
import deedOutputMappings from './deed/outputMappings';
import { IDeed } from './deed/deed';

import registryABI from './auction/registry.json';
import registryOutputMappings from './registry/outputMappings';
import { IRegistry } from './registry/registry';

import resolverABI from './auction/resolver.json';
import resolverOutputMappings from './resolver/outputMappings';
import { IResolver } from './resolver/resolver';

const auction: IAuction & Contract = new Contract(auctionABI, auctionOutputMappings) as any;

const deed: IDeed & Contract = new Contract(deedABI, deedOutputMappings) as any;

const registry: IRegistry & Contract = new Contract(registryABI, registryOutputMappings) as any;

const resolver: IResolver & Contract = new Contract(resolverABI, resolverOutputMappings) as any;

export default { auction, deed, registry, resolver };
