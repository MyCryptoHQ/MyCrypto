import { IRates } from '@types';

import { default as ApiService } from '../ApiService';
import { COINGECKO_BASE_URL } from './constants';

export const RatesService = () => {
  const service = ApiService.generateInstance({
    baseURL: COINGECKO_BASE_URL,
    timeout: 20000
  });

  const fetchAssetsRates = async (
    coinGeckoIds: string[],
    currencies: string[]
  ): Promise<IRates> => {
    return service
      .get('/simple/price', {
        params: {
          ids: coinGeckoIds.join(','),
          vs_currencies: currencies.join(','),
          include_24hr_change: true
        }
      })
      .then((res) => res.data)
      .catch((err) => {
        console.debug('[RatesService]: Error fetching rates: ', err);
      });
  };

  return { fetchAssetsRates };
};

export default RatesService();
