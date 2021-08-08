import { AxiosInstance } from 'axios';

import { OPENSEA_API } from '@config';
import { ApiService } from '@services/ApiService';

export default abstract class OpenSeaService {
  public static fetchAssets = async (owner: string) => {
    try {
      const { data } = await OpenSeaService.service.get('v1/assets', { params: { owner } });
      return data.assets;
    } catch (e) {
      console.debug('[OpenSea]: Fetching data from OpenSea failed: ', e);
      return null;
    }
  };

  private static service: AxiosInstance = ApiService.generateInstance({
    baseURL: OPENSEA_API,
    timeout: 15000
  });
}
