import { AxiosInstance } from 'axios';

import { OPENSEA_API } from '@config';
import { ApiService } from '@services/ApiService';

import { OpenSeaCollection, OpenSeaNFT } from './types';

export default abstract class OpenSeaService {
  public static fetchAssets = async (owner: string): Promise<OpenSeaNFT[] | null> => {
    try {
      const { data } = await OpenSeaService.service.get('v1/assets', { params: { owner } });
      return data.assets;
    } catch (e) {
      console.debug('[OpenSea]: Fetching data from OpenSea failed: ', e);
      return null;
    }
  };

  public static fetchCollections = async (
    asset_owner: string
  ): Promise<OpenSeaCollection[] | null> => {
    try {
      const { data } = await OpenSeaService.service.get('v1/collections', {
        params: { asset_owner }
      });
      return data;
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
