import { OPENSEA_API, OPENSEA_IMAGE_PROXY_API } from '@config';
import { ApiService } from '@services/ApiService';
import { getNFTURL } from '@utils';

import { OpenSeaCollection, OpenSeaNFT } from './types';

const NFT_LIMIT_PER_QUERY = 50; // Max allowed by OpenSea
const NFT_LIMIT_MAX = 1000; // To prevent overly spamming the API - @todo Discuss
const COLLECTION_LIMIT = 300; // @todo Discuss

export const OpenSeaService = () => {
  const service = ApiService.generateInstance({
    baseURL: OPENSEA_API,
    timeout: 15000
  });

  const fetchAllAssets = async (owner: string): Promise<OpenSeaNFT[]> => {
    let page = 0;
    let results = [] as OpenSeaNFT[];
    while (results.length < NFT_LIMIT_MAX) {
      const currentPage = await fetchAssets(owner, page);
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

  const fetchAssets = async (owner: string, page: number): Promise<OpenSeaNFT[] | null> => {
    try {
      const offset = page * NFT_LIMIT_PER_QUERY;
      const { data } = await service.get('v1/assets', {
        params: { owner, offset, limit: NFT_LIMIT_PER_QUERY }
      });
      return data.assets;
    } catch (e) {
      console.debug('[OpenSea]: Fetching data from OpenSea failed: ', e);
      return null;
    }
  };

  const fetchCollections = async (asset_owner: string): Promise<OpenSeaCollection[] | null> => {
    try {
      const { data } = await service.get('v1/collections', {
        params: { asset_owner, limit: COLLECTION_LIMIT }
      });
      return data;
    } catch (e) {
      console.debug('[OpenSea]: Fetching data from OpenSea failed: ', e);
      return null;
    }
  };

  const proxyAssets = async (assets: OpenSeaNFT[]): Promise<boolean> => {
    try {
      const result = await service.post(
        '',
        {
          assetURLs: assets.map((a) => getNFTURL(a)).filter((a) => a && a.length > 0)
        },
        { baseURL: OPENSEA_IMAGE_PROXY_API, timeout: 60000 }
      );
      return result.status === 200;
    } catch (e) {
      console.debug('[OpenSea]: Proxying images failed: ', e);
      return false;
    }
  };

  return { fetchAllAssets, fetchAssets, fetchCollections, proxyAssets };
};

export default OpenSeaService();
