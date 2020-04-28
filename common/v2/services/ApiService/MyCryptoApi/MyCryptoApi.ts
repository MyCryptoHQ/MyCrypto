import { AxiosInstance } from 'axios';

import { MYC_API } from 'v2/config';

import { default as ApiService } from '../ApiService';

let instantiated: boolean = false;

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

  public getAssets = async () => {
    try {
      const { data } = await this.service.get('assets.json');
      return data;
    } catch (e) {
      throw e;
    }
  };
}
