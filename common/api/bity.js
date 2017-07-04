import axios from 'axios';
import bityConfig from 'config/bity';

// https://stackoverflow.com/questions/9828684/how-to-get-all-arguments-of-a-callback-function
export function combineAndUpper() {
  const args = [];
  let newString = '';
  for (let i = 0; i < arguments.length; ++i) args[i] = arguments[i];
  args.forEach(each => {
    newString = newString.concat(each.toUpperCase());
  });
  return newString;
}

function findRateFromBityRateList(rateObjects, pairName) {
  return rateObjects.find(x => x.pair === pairName);
}

function _getRate(bityRates, origin, destination) {
  const pairName = combineAndUpper(origin, destination);
  const rateObjects = bityRates.data.objects;
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
    bityRates.data.objects.forEach(each => {
      const pairName = each.pair;
      mappedRates[pairName] = parseFloat(each.rate_we_sell);
    });
    return mappedRates;
  });
  // TODO - catch errors
}

function _getAllRates() {
  const path = '/v1/rate2/';
  const bityURL = bityConfig.bityAPI + path;
  return axios.get(bityURL);
}

function requestStatus() {}
