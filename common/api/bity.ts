import bityConfig, { WhitelistedCoins } from 'config/bity';
import { checkHttpStatus, parseJSON, filter } from './utils';
import bitcoinIcon from 'assets/images/bitcoin.png';
import repIcon from 'assets/images/augur.png';
import etherIcon from 'assets/images/ether.png';

const isCryptoPair = (from: string, to: string, arr: WhitelistedCoins[]) => {
  return filter(from, arr) && filter(to, arr);
};

const btcOptions = {
  id: 'BTC',
  status: 'available',
  image: bitcoinIcon,
  name: 'Bitcoin'
};

const ethOptions = {
  id: 'ETH',
  status: 'available',
  image: etherIcon,
  name: 'Ether'
};

const repOptions = {
  id: 'REP',
  status: 'available',
  image: repIcon,
  name: 'Augur'
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
        let fromOptions;
        let toOptions;
        switch (from.id) {
          case 'BTC':
            fromOptions = btcOptions;
            break;
          case 'ETH':
            fromOptions = ethOptions;
            break;
          case 'REP':
            fromOptions = repOptions;
        }
        switch (to.id) {
          case 'BTC':
            toOptions = btcOptions;
            break;
          case 'ETH':
            toOptions = ethOptions;
            break;
          case 'REP':
            toOptions = repOptions;
        }
        mappedRates[pairName] = {
          id: pairName,
          options: [fromOptions, toOptions],
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
