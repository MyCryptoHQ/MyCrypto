import { AxiosInstance } from 'axios';
import { default as ApiService } from '../ApiService';

let instantiated: boolean = false;

const ASSET_ID_MAPPING_URL = 'https://price.mycryptoapi.com';

export default class AssetMapService {
  public static instance = new AssetMapService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: ASSET_ID_MAPPING_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`AssetMapService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getAssetMap = async () => {
    try {
      return this.service.get('').then(res => res.data);
    } catch (e) {
      throw e;
    }
  };
}
