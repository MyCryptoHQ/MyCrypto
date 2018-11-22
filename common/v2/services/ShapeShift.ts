import APIService from './APIService';
import { createAssetMap, getAssetIntersection } from './helpers';

let instantiated = false;

export default class ShapeShiftService {
  public static instance = new ShapeShiftService();

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
      const { data } = await this.service.get(`/validpairs`);
      const assetMap = createAssetMap(data);
      const validPairs = getAssetIntersection(Object.keys(assetMap));

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
