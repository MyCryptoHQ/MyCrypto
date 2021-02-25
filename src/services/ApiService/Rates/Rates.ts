import { AxiosInstance } from 'axios';

import { default as ApiService } from '../ApiService';
import { COINGECKO_RATES_API } from './constants';

let instantiated = false;

export default class RatesService {
  public static instance = new RatesService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: COINGECKO_RATES_API,
    timeout: 20000
  });

  constructor() {
    if (instantiated) {
      throw new Error('fancy error ');
    } else {
      instantiated = true;
    }
  }

  // @todo: figure out return type
  public fetchAssetsRates = async (coinGeckoIds: string[], currencies: string[]): Promise<any> => {
    return this.service
      .get('/', {
        params: { ids: coinGeckoIds.join(','), vs_currencies: currencies.join(',') }
      })
      .then((res) => res.data)
      .catch((err) => {
        console.debug('[RatesService]: Error fetching rates: ', err);
      });
  };
}
