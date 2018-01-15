import { checkHttpStatus, parseJSON } from 'api/utils';

const SHAPESHIFT_BASE_URL = 'https://shapeshift.io';

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
export const SHAPESHIFT_WHITELIST = [...SHAPESHIFT_TOKEN_WHITELIST, 'ETH', 'ETC', 'BTC'];

class ShapeshiftService {
  public whitelist = SHAPESHIFT_WHITELIST;
  private url = SHAPESHIFT_BASE_URL;
  private apiKey = '0ca1ccd50b708a3f8c02327f0caeeece06d3ddc1b0ac749a987b453ee0f4a29bdb5da2e53bc35e57fb4bb7ae1f43c93bb098c3c4716375fc1001c55d8c94c160';
  private postHeaders = {
    'Content-Type': 'application/json'
  };

  public checkStatus(address) {
    return fetch(`${this.url}/txStat/${address}`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  public sendAmount(withdrawal, originKind, destinationKind, destinationAmount) {
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
    const pairRates = await this.getPairRates(marketInfo);
    const checkAvl = await this.checkAvl(pairRates);
    const mappedRates = this.mapMarketInfo(checkAvl);
    return mappedRates;
  };

  private getPairRates(marketInfo) {
    const filteredMarketInfo = marketInfo.filter(obj => {
      const { pair } = obj;
      const pairArr = pair.split('_');
      return this.whitelist.includes(pairArr[0]) && this.whitelist.includes(pairArr[1])
        ? true
        : false;
    });
    const pairRates = filteredMarketInfo.map(p => {
      const { pair } = p;
      const singlePair = Promise.resolve(this.getSinglePairRate(pair));
      return { ...p, ...singlePair };
    });
    return pairRates;
  }

  private async checkAvl(pairRates) {
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
    return mapAvl;
  }

  private getAvlCoins() {
    return fetch(`${this.url}/getcoins`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  private getSinglePairRate(pair) {
    return fetch(`${this.url}/rate/${pair}`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  private getMarketInfo() {
    return fetch(`${this.url}/marketinfo`)
      .then(checkHttpStatus)
      .then(parseJSON);
  }

  private isWhitelisted(coin) {
    return this.whitelist.includes(coin);
  }

  private mapMarketInfo(marketInfo) {
    const tokenMap = {};
    marketInfo.forEach(m => {
      const originKind = m.pair.substring(0, 3);
      const destinationKind = m.pair.substring(4, 7);
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
