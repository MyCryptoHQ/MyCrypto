import bityConfig, { WhitelistedCoins } from 'config/bity';
import { checkHttpStatus, parseJSON, filter } from './utils';

const isCryptoPair = (from: string, to: string, arr: WhitelistedCoins[]) => {
  return filter(from, arr) && filter(to, arr);
};

export function getAllRates() {
  const mappedRates = {};
  return _getAllRates().then(bityRates => {
    bityRates.objects.forEach(each => {
      const pairName = each.pair;
      const from = { id: pairName.substring(0, 3) };
      const to = { id: pairName.substring(3, 6) };
      // Check if rate exists= && check if the pair only crypto to crypto, not crypto to fiat, or any other combination
      if (parseFloat(each.rate_we_sell) && isCryptoPair(from.id, to.id, ['BTC', 'ETH', 'REP'])) {
        mappedRates[pairName] = {
          id: pairName,
          options: [from, to],
          rate: parseFloat(each.rate_we_sell)
        };
      }
    });
    return mappedRates;
  });
}

export function postOrder(amount: number, destAddress: string, mode: number, pair: string) {
  return fetch(`${bityConfig.serverURL}/order`, {
    method: 'post',
    body: JSON.stringify({
      amount,
      destAddress,
      mode,
      pair
    }),
    headers: new Headers(bityConfig.postConfig.headers)
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

export function getOrderStatus(orderId: string) {
  return fetch(`${bityConfig.serverURL}/status`, {
    method: 'POST',
    body: JSON.stringify({
      orderid: orderId
    }),
    headers: new Headers(bityConfig.postConfig.headers)
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

function _getAllRates() {
  return fetch(`${bityConfig.bityURL}/v1/rate2/`)
    .then(checkHttpStatus)
    .then(parseJSON);
}
