// @flow
import Contract from '../../contract/index'; // for some reason default dir import fails, needed to explictly define index
const auctionABI = require('./auction.json');
const deedABI = require('./deed.json');
const registryABI = require('./registry.json');
const resolverABI = require('./resolver.json');
const auction = new Contract(auctionABI);
const deed = new Contract(deedABI);
const registry = new Contract(registryABI);
const resolver = new Contract(resolverABI);
export default { auction, deed, registry, resolver };
