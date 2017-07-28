// @flow
import bityConfig from 'config/bity';
import { checkHttpStatus, parseJSON } from './utils';
import { combineAndUpper } from 'utils/formatters';

function findRateFromBityRateList(rateObjects, pairName: string) {
  return rateObjects.find(x => x.pair === pairName);
}

function _getRate(bityRates, originKind: string, destinationKind: string) {
  const pairName = combineAndUpper(originKind, destinationKind);
  const rateObjects = bityRates.objects;
  return findRateFromBityRateList(rateObjects, pairName);
}

/**
 * Gives you multiple rates from Bitys API without making multiple API calls
 * @param arrayOfOriginAndDestinationObjects - [{origin: 'BTC', destination: 'ETH'}, {origin: 'BTC', destination: 'REP}]
 */
export type TransactionPair = {
  originKind: string,
  destinationKind: string
};
function getMultipleRates(transactionPairs: TransactionPair[]) {
  const mappedRates = {};
  return _getAllRates().then(bityRates => {
    transactionPairs.forEach(each => {
      const originKind = each.originKind;
      const destinationKind = each.destinationKind;
      const pairName = combineAndUpper(originKind, destinationKind);
      const rate = _getRate(bityRates, originKind, destinationKind);
      mappedRates[pairName] = parseFloat(rate.rate_we_sell);
    });
    return mappedRates;
  });
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
}

export function postOrder(
  amount: number,
  destAddress: string,
  mode: number,
  pair: string
) {
  return fetch(`${bityConfig.serverURL}/order`, {
    method: 'post',
    body: JSON.stringify({
      amount,
      destAddress,
      mode,
      pair
    }),
    headers: bityConfig.postConfig.headers
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

export function getOrderStatus(orderid: string) {
  return fetch(`${bityConfig.serverURL}/status`, {
    method: 'POST',
    body: JSON.stringify({
      orderid
    }),
    headers: bityConfig.postConfig.headers
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

function _getAllRates() {
  return fetch(`${bityConfig.bityAPI}/v1/rate2/`)
    .then(checkHttpStatus)
    .then(parseJSON);
}

function requestOrderStatus() {}
