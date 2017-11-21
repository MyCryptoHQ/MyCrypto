import bityConfig from 'config/bity';
import { checkHttpStatus, parseJSON } from './utils';
import { indexOf } from 'lodash';

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

const exists = (dataType, id) => {
  const isArray = Array.isArray(dataType);
  // lodash `indexOf()` returns the array index of an existing value (id), or returns -1
  return isArray ? !(-1 === indexOf(dataType, id)) : !!dataType[id];
};

// TODO: Clean this mess up – remove shadowed variable names and sprinkle on some syntactic sugar
export const getRates = () => {
  const mappedRates = {};
  return _getAllRates().then(bityRates => {
    bityRates.objects.forEach(each => {
      const pairName = each.pair;
      mappedRates[pairName] = parseFloat(each.rate_we_sell);
    });
    const format = arr => {
      return arr.reduce((array, val, index) => {
        array[index] = { id: val };
        return array;
      }, []);
    };
    const rates = () => {
      const type = i => {
        const c = input => exists(currencies(), input);
        const a = input => exists(assets(), input);
        return a(i) ? 'assets' : c(i) ? 'currencies' : null;
      };
      const array: {}[] = [];
      Object.keys(mappedRates).forEach(key => {
        const from = key.substring(0, 3);
        const to = key.substring(3, 6);
        if (mappedRates[key]) {
          array.push({
            id: key,
            origType: type(from),
            destType: type(to),
            from,
            to,
            rate: mappedRates[key]
          });
        }
      });
      return array;
    };
    const isCurrency = id => {
      return id === 'USD' || id === 'EUR' || id === 'CHF';
    };
    const currencies = () => {
      const ids: string[] = [];
      Object.keys(mappedRates).forEach(key => {
        const id = key.substring(0, 3);
        if (!exists(ids, id) && isCurrency(id)) {
          ids.push(id);
        }
      });
      return ids;
    };
    const assets = () => {
      const ids: string[] = [];
      Object.keys(mappedRates).forEach(key => {
        const id = key.substring(0, 3);
        if (!exists(ids, id) && !isCurrency(id)) {
          ids.push(id);
        }
      });
      return ids;
    };
    const data = { assets: assets(), currencies: currencies(), rates: rates() };
    console.log(data);
  });
};

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

export function getOrderStatus(orderId: string) {
  return fetch(`${bityConfig.serverURL}/status`, {
    method: 'POST',
    body: JSON.stringify({
      orderid: orderId
    }),
    headers: bityConfig.postConfig.headers
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

function _getAllRates() {
  return fetch(`${bityConfig.bityURL}/v1/rate2/`)
    .then(checkHttpStatus)
    .then(parseJSON);
}
