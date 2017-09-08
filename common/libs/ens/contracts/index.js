// @flow
import Contract from '../../contract/index'; // for some reason default dir import fails, needed to explictly define index
const auctionABI = require('./auction/auction.json');
import auctionOutputMappings from './auction/outputMappings';

const deedABI = require('./deed/deed.json');
import deedOutputMappings from './deed/outputMappings';

const registryABI = require('./registry/registry.json');
import registryOutputMappings from './registry/outputMappings';

const resolverABI = require('./resolver/resolver.json');
import resolverOutputMappings from './resolver/outputMappings';

const auction: Object = new Contract(auctionABI, auctionOutputMappings);
const deed: Object = new Contract(deedABI, deedOutputMappings);
const registry: Object = new Contract(registryABI, registryOutputMappings);
const resolver: Object = new Contract(resolverABI, resolverOutputMappings);

export default { auction, deed, registry, resolver };
