import { AxiosInstance } from 'axios';

import { MYC_API } from '@config';
import { ExtendedAsset, TUuid } from '@types';
import { mapObjIndexed } from '@vendor';

import { default as ApiService } from '../ApiService';

let instantiated = false;

export default class MyCryptoApiService {
  public static instance = new MyCryptoApiService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: MYC_API
  });

  constructor() {
    if (instantiated) {
      throw new Error(`MyCryptoApiService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getAssets = async (): Promise<Record<TUuid, ExtendedAsset>> => {
    try {
      const { data } = await this.service.get<Record<TUuid, ExtendedAsset>>('assets.json');
      return mapObjIndexed((asset) => ({ ...asset, isCustom: false }), data);
    } catch (e) {
      console.debug('[MyCryptoApiService]: Fetching assets failed: ', e);
      return {};
    }
  };
}
