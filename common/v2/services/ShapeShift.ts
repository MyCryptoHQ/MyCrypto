import get from 'lodash/get';

import APIService from './API';
import {
  Cache,
  cachedValueIsFresh,
  addValueToCache,
  removeValueFromCache,
  createAssetMap,
  getAssetIntersection
} from './helpers';

let instantiated = false;

export default class ShapeShiftService {
  public static instance = new ShapeShiftService();

  private cache: Cache = {};

  private service = APIService.generateInstance({
    baseURL: 'https://shapeshift.io'
  });

  public constructor() {
    if (instantiated) {
      throw new Error(`ShapeShiftService has already been instantiated.`);
    }

    instantiated = true;
  }

  public async getValidPairs() {
    try {
      const cachedPairs = get(this.cache, 'validPairs', {});

      if (cachedValueIsFresh(cachedPairs)) {
        return get(cachedPairs, 'value');
      } else {
        removeValueFromCache(this.cache, 'validPairs');
      }

      const { data } = await this.service.get(`/validpairs`);
      const assetMap = createAssetMap(data);
      const validPairs = getAssetIntersection(Object.keys(assetMap));

      addValueToCache(this.cache, 'validPairs', validPairs);

      return validPairs;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('getValidPairs()', error);
      }

      return [];
    }
  }

  public async getMarketInfo(pair?: string) {
    try {
      const url = `/marketinfo/${pair || ''}`;
      const { data } = await this.service.get(url);

      return data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('getMarketInfo()', error);
      }

      return null;
    }
  }
}
