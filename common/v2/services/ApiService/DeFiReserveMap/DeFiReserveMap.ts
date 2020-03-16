import { AxiosInstance } from 'axios';
import { default as ApiService } from '../ApiService';

let instantiated: boolean = false;

// TODO: Change this once api endpoint becomes avail
const DEFI_RESERVE_MAPPING_URL = 'https://defi.mycryptoapi.com';

export default class DeFiReserveMapService {
  public static instance = new DeFiReserveMapService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: DEFI_RESERVE_MAPPING_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`DeFiReserveMapService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getDeFiReserveMap = async () => {
    try {
      return this.service.get('').then(res => res.data);
    } catch (e) {
      throw e;
    }
  };
}
