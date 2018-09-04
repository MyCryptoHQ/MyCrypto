import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';

import { checkHttpStatus, parseJSON } from 'api/utils';

export const SHAPESHIFT_API_KEY =
  '8abde0f70ca69d5851702d57b10305705d7333e93263124cc2a2649dab7ff9cf86401fc8de7677e8edcd0e7f1eed5270b1b49be8806937ef95d64839e319e6d9';

export const SHAPESHIFT_BASE_URL = 'https://shapeshift.io';

export const SHAPESHIFT_TOKEN_WHITELIST = [
  'OMG',
  'REP',
  'SNT',
  'SNGLS',
  'ZRX',
  'SWT',
  'ANT',
  'BAT',
  'BNT',
  'CVC',
  'DNT',
  '1ST',
  'GNO',
  'GNT',
  'EDG',
  'FUN',
  'RLC',
  'TRST',
  'GUP'
];
export const SHAPESHIFT_WHITELIST = [...SHAPESHIFT_TOKEN_WHITELIST, 'ETH', 'ETC', 'BTC', 'XMR'];

interface IPairData {
  limit: number;
  maxLimit: number;
  min: number;
  minerFee: number;
  pair: string;
  rate: string;
}

interface IExtraPairData {
  status: string;
  image: string;
  name: string;
}

interface IAvailablePairData {
  [pairName: string]: IExtraPairData;
}

interface ShapeshiftMarketInfo {
  rate: string;
  limit: number;
  pair: string;
  maxLimit: number;
  min: number;
  minerFee: number;
}

interface TokenMap {
  [pairName: string]: {
    id: string;
    rate: string;
    limit: number;
    min: number;
    options: (IExtraPairData & { id: string })[];
  };
}

interface ShapeshiftCoinInfo {
  image: string;
  imageSmall: string;
  minerFee: number;
  name: string;
  status: string;
  symbol: string;
}

interface ShapeshiftCoinInfoMap {
  [id: string]: ShapeshiftCoinInfo;
}

interface ShapeshiftOption {
  id?: string;
  status?: string;
  image?: string;
}

interface ShapeshiftOptionMap {
  [symbol: string]: ShapeshiftOption;
}

class ShapeshiftService {
  public whitelist = SHAPESHIFT_WHITELIST;
  private url = SHAPESHIFT_BASE_URL;
  private apiKey = SHAPESHIFT_API_KEY;
  private postHeaders = {
    'Content-Type': 'application/json'
  };
  private supportedCoinsAndTokens: ShapeshiftCoinInfoMap = {};
  private fetchedSupportedCoinsAndTokens = false;

  public checkStatus(address: string) {
    return fetch(`${this.url}/txStat/${address}`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  public sendAmount(
    withdrawal: string,
    originKind: string,
    destinationKind: string,
    destinationAmount: number
  ) {
    const pair = `${originKind.toLowerCase()}_${destinationKind.toLowerCase()}`;

    return fetch(`${this.url}/sendamount`, {
      method: 'POST',
      body: JSON.stringify({
        amount: destinationAmount,
        pair,
        apiKey: this.apiKey,
        withdrawal
      }),
      headers: new Headers(this.postHeaders)
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .catch(err => {
        // CORS rejection, meaning metamask don't want us
        if (err.name === 'TypeError') {
          throw new Error(
            'Shapeshift has blocked this request, visit shapeshift.io for more information or contact support'
          );
        }
      });
  }

  public getCoins() {
    return fetch(`${this.url}/getcoins`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  public getAllRates = async () => {
    const marketInfo = await this.getMarketInfo();
    const pairRates = this.filterPairs(marketInfo);
    const checkAvl = await this.checkAvl(pairRates);
    const mappedRates = this.mapMarketInfo(checkAvl);
    const allRates = this.addUnavailableCoinsAndTokens(mappedRates);

    return allRates;
  };

  public addUnavailableCoinsAndTokens = (availableCoinsAndTokens: TokenMap) => {
    if (this.fetchedSupportedCoinsAndTokens) {
      /** @desc Create a hash for efficiently checking which tokens are currently available. */
      const allOptions = flatten(
        Object.values(availableCoinsAndTokens).map(({ options }) => options)
      );
      const availableOptions: ShapeshiftOptionMap = uniqBy(allOptions, 'id').reduce(
        (prev: ShapeshiftOptionMap, next) => {
          prev[next.id] = next;
          return prev;
        },
        {}
      );

      const unavailableCoinsAndTokens = this.whitelist
        .map(token => {
          /** @desc ShapeShift claims support for the token and it is available. */
          const availableCoinOrToken = availableOptions[token];

          if (availableCoinOrToken) {
            return null;
          }

          /** @desc ShapeShift claims support for the token, but it is unavailable. */
          const supportedCoinOrToken = this.supportedCoinsAndTokens[token];

          if (supportedCoinOrToken) {
            const { symbol: id, image, name, status } = supportedCoinOrToken;

            return {
              /** @desc Preface the false id with '__' to differentiate from actual pairs. */
              id: `__${id}`,
              limit: 0,
              min: 0,
              options: [{ id, image, name, status }]
            };
          }

          /** @desc We claim support for the coin or token, but ShapeShift doesn't. */
          return null;
        })
        .reduce((prev: ShapeshiftOptionMap, next) => {
          if (next) {
            prev[next.id] = next;

            return prev;
          }

          return prev;
        }, {});

      return { ...availableCoinsAndTokens, ...unavailableCoinsAndTokens };
    }

    return availableCoinsAndTokens;
  };

  private filterPairs(marketInfo: ShapeshiftMarketInfo[]) {
    return marketInfo.filter(obj => {
      const { pair } = obj;
      const pairArr = pair.split('_');
      return this.whitelist.includes(pairArr[0]) && this.whitelist.includes(pairArr[1]);
    });
  }

  private async checkAvl(pairRates: IPairData[]) {
    const avlCoins = await this.getAvlCoins();
    const mapAvl = pairRates.map(p => {
      const { pair } = p;
      const pairArr = pair.split('_');

      if (pairArr[0] in avlCoins && pairArr[1] in avlCoins) {
        return {
          ...p,
          ...{
            [pairArr[0]]: {
              name: avlCoins[pairArr[0]].name,
              status: avlCoins[pairArr[0]].status,
              image: avlCoins[pairArr[0]].image
            },
            [pairArr[1]]: {
              name: avlCoins[pairArr[1]].name,
              status: avlCoins[pairArr[1]].status,
              image: avlCoins[pairArr[1]].image
            }
          }
        };
      }
    });
    const filered = mapAvl.filter(v => v);
    return filered as (IPairData & IAvailablePairData)[];
  }

  private getAvlCoins() {
    return fetch(`${this.url}/getcoins`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(supportedCoinsAndTokens => {
        this.supportedCoinsAndTokens = supportedCoinsAndTokens;
        this.fetchedSupportedCoinsAndTokens = true;

        return supportedCoinsAndTokens;
      });
  }

  private getMarketInfo() {
    return fetch(`${this.url}/marketinfo`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  private isWhitelisted(coin: string) {
    return this.whitelist.includes(coin);
  }

  private mapMarketInfo(marketInfo: (IPairData & IAvailablePairData)[]) {
    const tokenMap: TokenMap = {};
    marketInfo.forEach(m => {
      const [originKind, destinationKind] = m.pair.split('_');
      if (this.isWhitelisted(originKind) && this.isWhitelisted(destinationKind)) {
        const pairName = originKind + destinationKind;
        const { rate, limit, min } = m;
        tokenMap[pairName] = {
          id: pairName,
          options: [
            {
              id: originKind,
              status: m[originKind].status,
              image: m[originKind].image,
              name: m[originKind].name
            },
            {
              id: destinationKind,
              status: m[destinationKind].status,
              image: m[destinationKind].image,
              name: m[destinationKind].name
            }
          ],
          rate,
          limit,
          min
        };
      }
    });
    return tokenMap;
  }
}

const shapeshift = new ShapeshiftService();

export default shapeshift;
