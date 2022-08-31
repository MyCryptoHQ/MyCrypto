import { AxiosInstance } from 'axios';

import { DEFI_RESERVE_MAPPING_URL } from '@config';
import { translateRaw } from '@translations';

import { default as ApiService } from '../ApiService';

let instantiated = false;

export default class DeFiReserveMapService {
  public static instance = new DeFiReserveMapService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: DEFI_RESERVE_MAPPING_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(translateRaw('DEFI_RESERVE_MAP_ERR'));
    } else {
      instantiated = true;
    }
  }

  public getDeFiReserveMap = () => {
    return this.service.get('').then((res) => res.data);
  };
}
