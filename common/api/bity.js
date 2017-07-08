// @flow
import bityConfig from 'config/bity';

export function combineAndUpper(...args: string[]) {
  return args.reduce((acc, item) => acc.concat(item.toUpperCase()), '');
}

function findRateFromBityRateList(rateObjects, pairName) {
  return rateObjects.find(x => x.pair === pairName);
}

// FIXME better types
function _getRate(bityRates, origin: string, destination: string) {
  const pairName = combineAndUpper(origin, destination);
  const rateObjects = bityRates.objects;
  return findRateFromBityRateList(rateObjects, pairName);
}

/**
 * Gives you multiple rates from Bitys API without making multiple API calls
 * @param arrayOfOriginAndDestinationDicts - [{origin: 'BTC', destination: 'ETH'}, {origin: 'BTC', destination: 'REP}]
 */
function getMultipleRates(arrayOfOriginAndDestinationDicts) {
  const mappedRates = {};
  return _getAllRates().then(bityRates => {
    arrayOfOriginAndDestinationDicts.forEach(each => {
      const origin = each.origin;
      const destination = each.destination;
      const pairName = combineAndUpper(origin, destination);
      const rate = _getRate(bityRates, origin, destination);
      mappedRates[pairName] = parseFloat(rate.rate_we_sell);
    });
    return mappedRates;
  });
  // TODO - catch errors
}

export function getAllRates() {
  const mappedRates = {};
  return _getAllRates().then(bityRates => {
    bityRates.objects.forEach(each => {
      const pairName = each.pair;
      mappedRates[pairName] = parseFloat(each.rate_we_sell);
    });
    return mappedRates;
  });
  // TODO - catch errors
}

function _getAllRates() {
  return fetch(`${bityConfig.bityAPI}/v1/rate2/`).then(r => r.json());
}

function requestStatus() {}
