import axios from 'axios';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import queryString from 'query-string';

import { checkHttpStatus, parseJSON } from 'api/utils';

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
export const SHAPESHIFT_ACCESS_TOKEN = 'c640aa85-dd01-4db1-a6f2-ed57e6fd6c54';
export const SHAPESHIFT_API_URL = 'https://auth.shapeshift.io/oauth/authorize';
export const SHAPESHIFT_CLIENT_ID = 'fcbbb372-4221-4436-b345-024d91384652';
export const SHAPESHIFT_REDIRECT_URI = 'https://mycrypto.com/swap';

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
  private supportedCoinsAndTokens: ShapeshiftCoinInfoMap = {};
  private fetchedSupportedCoinsAndTokens = false;
  private token: string | null = null;

  public constructor() {
    this.retrieveAccessTokenFromStorage();

    if (process.env.BUILD_ELECTRON) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.on('shapeshift-set-token', (_: any, token: string) =>
        this.saveAccessTokenToStorage(token)
      );
    }
  }

  public hasToken() {
    return !!window.localStorage.getItem(SHAPESHIFT_ACCESS_TOKEN);
  }

  public urlHasCodeParam() {
    return !!queryString.parse(window.location.search).code;
  }

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
        withdrawal
      }),
      headers: new Headers(this.getPostHeaders())
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

  public sendUserToAuthorize = () => {
    const query = queryString.stringify({
      client_id: SHAPESHIFT_CLIENT_ID,
      scope: 'users:read',
      response_type: 'code',
      redirect_uri: SHAPESHIFT_REDIRECT_URI
    });
    const url = `${SHAPESHIFT_API_URL}?${query}`;

    if (process.env.BUILD_ELECTRON) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.send('shapeshift-authorize', url);
    } else {
      window.open(url, '_blank', 'width=800, height=600, menubar=yes');
    }
  };

  public requestAccessToken = async () => {
    const { code } = queryString.parse(window.location.search);
    const {
      data: { access_token: token }
    } = await axios.post('https://proxy.mycryptoapi.com/request-shapeshift-token', {
      code,
      grant_type: 'authorization_code'
    });

    this.token = token;
    this.saveAccessTokenToStorage(token);

    if (process.env.BUILD_ELECTRON) {
      const { ipcRenderer } = (window as any).require('electron');

      ipcRenderer.send('shapeshift-token-retrieved', token);
    }
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

  private getPostHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`
  });

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

  private saveAccessTokenToStorage = (token: string) => {
    if (window && window.localStorage) {
      window.localStorage.setItem(SHAPESHIFT_ACCESS_TOKEN, token);
    }
  };

  private retrieveAccessTokenFromStorage = () => {
    if (window && window.localStorage) {
      const token = window.localStorage.getItem(SHAPESHIFT_ACCESS_TOKEN);
      this.token = token;
    }
  };
}

const shapeshift = new ShapeshiftService();

export default shapeshift;
