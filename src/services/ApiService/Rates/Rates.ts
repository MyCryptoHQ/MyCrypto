import { IRates } from '@types';

import { default as ApiService } from '../ApiService';
import { COINGECKO_RATES_API } from './constants';

export const RatesService = () => {
  const service = ApiService.generateInstance({
    baseURL: COINGECKO_RATES_API,
    timeout: 20000
  });

  const fetchAssetsRates = async (
    coinGeckoIds: string[],
    currencies: string[]
  ): Promise<IRates> => {
    return service
      .get('/', {
        params: { ids: coinGeckoIds.join(','), vs_currencies: currencies.join(',') }
      })
      .then((res) => res.data)
      .catch((err) => {
        console.debug('[RatesService]: Error fetching rates: ', err);
      });
  };

  return { fetchAssetsRates };
};

export default RatesService();
