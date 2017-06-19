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

export default class Bity {
  findRateFromBityRateList(rateObjects, pairName) {
    return rateObjects.find(x => x.pair === pairName);
  }

  _getRate(bityRates, origin, destination) {
    const pairName = combineAndUpper(origin, destination);
    const rateObjects = bityRates.data.objects;
    return this.findRateFromBityRateList(rateObjects, pairName);
  }

  /**
     * Gives you multiple rates from Bitys API without making multiple API calls
     * @param arrayOfOriginAndDestinationDicts - [{origin: 'BTC', destination: 'ETH'}, {origin: 'BTC', destination: 'REP}]
     */
  getMultipleRates(arrayOfOriginAndDestinationDicts) {
    const mappedRates = {};
    return this.requestAllRates().then(bityRates => {
      arrayOfOriginAndDestinationDicts.forEach(each => {
        const origin = each.origin;
        const destination = each.destination;
        const pairName = combineAndUpper(origin, destination);
        const rate = this._getRate(bityRates, origin, destination);
        mappedRates[pairName] = parseFloat(rate.rate_we_sell);
      });
      return mappedRates;
    });
    // TODO - catch errors
  }

  getAllRates() {
    const mappedRates = {};
    return this.requestAllRates().then(bityRates => {
      bityRates.data.objects.forEach(each => {
        const pairName = each.pair;
        mappedRates[pairName] = parseFloat(each.rate_we_sell);
      });
      return mappedRates;
    });
    // TODO - catch errors
  }

  requestAllRates() {
    const path = '/v1/rate2/';
    const bityURL = bityConfig.bityAPI + path;
    return axios.get(bityURL);
  }
}
