import { AxiosInstance } from 'axios';

import { OPENSEA_API } from '@config';
import { ApiService } from '@services/ApiService';

import { OpenSeaCollection, OpenSeaNFT } from './types';

const NFT_LIMIT_PER_QUERY = 50; // Max allowed by OpenSea
const NFT_LIMIT_MAX = 1000; // To prevent overly spamming the API - @todo Discuss

export default abstract class OpenSeaService {
  // @todo Make prettier
  public static fetchAllAssets = async (owner: string): Promise<OpenSeaNFT[]> => {
    let page = 0;
    let results = [] as OpenSeaNFT[];
    while (results.length < NFT_LIMIT_MAX) {
      const currentPage = await OpenSeaService.fetchAssets(owner, page);
      if (currentPage) {
        results = results.concat(currentPage);
      }
      if (currentPage?.length === NFT_LIMIT_PER_QUERY) {
        page++;
      } else {
        break;
      }
    }
    return results;
  };

  public static fetchAssets = async (owner: string, page: number): Promise<OpenSeaNFT[] | null> => {
    try {
      const offset = page * NFT_LIMIT_PER_QUERY;
      const { data } = await OpenSeaService.service.get('v1/assets', {
        params: { owner, offset, limit: NFT_LIMIT_PER_QUERY }
      });
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
