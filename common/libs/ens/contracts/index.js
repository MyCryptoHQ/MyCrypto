// @flow
import Contract from '../../contract/index'; // for some reason default dir import fails, needed to explictly define index
const auctionABI = require('./auction/auction.json');
const auctionOutputMappings = require('./auction/outputMappings');

const deedABI = require('./deed/deed.json');
const deedOutputMappings = require('./deed/outputMappings');

const registryABI = require('./registry/registry.json');
const registryOutputMappings = require('./registry/outputMappings');

const resolverABI = require('./resolver/resolver.json');
const resolverOutputMappings = require('./resolver/outputMappings');

const auction = new Contract(auctionABI, auctionOutputMappings);
const deed = new Contract(deedABI, deedOutputMappings);
const registry = new Contract(registryABI, registryOutputMappings);
const resolver = new Contract(resolverABI, resolverOutputMappings);

export default { auction, deed, registry, resolver };
