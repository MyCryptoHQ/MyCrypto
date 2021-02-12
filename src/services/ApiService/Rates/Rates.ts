import { AxiosInstance } from 'axios';

import { default as ApiService } from '../ApiService';
import { COINGECKO_RATES_API } from './constants';

let instantiated = false;

export default class RatesService {
  public static instance = new RatesService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: COINGECKO_RATES_API,
    timeout: 5000
  });

  constructor() {
    if (instantiated) {
      throw new Error('fancy error ');
    } else {
      instantiated = true;
    }
  }

  // @todo: figure out return type
  public fetchAssetsRates = async (assets: string[], currencies: string[]): Promise<any> => {
    return fetch(`${COINGECKO_RATES_API}/?ids=${assets}&vs_currencies=${currencies}`)
      .then((res) => {
        debugger;
        const data = res.json();
        return data;
      })
      .catch((err) => {
        console.debug('[RatesService]: Error fetching rates: ', err);
      });
  };
}
