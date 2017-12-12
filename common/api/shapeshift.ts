import { checkHttpStatus, parseJSON } from 'api/utils';

const SHAPESHIFT_BASE_URL = 'https://shapeshift.io';
const SHAPESHIFT_WHITELIST = [
  'ETC',
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
  'GUP',
  'ETH',
  'BTC'
];

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

    console.log('destamt', {
      amount: destinationAmount,
      pair,
      apiKey: this.apiKey,
      withdrawal
    });
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
      .then(parseJSON);
  }

  public getAllRates = async () => {
    const marketInfo = await this.getMarketInfo();
    const mappedRates = this.mapMarketInfo(marketInfo);
    return mappedRates;
  };
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
          options: [{ id: originKind }, { id: destinationKind }],
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
