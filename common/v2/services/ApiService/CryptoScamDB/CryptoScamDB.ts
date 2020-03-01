import { AxiosInstance } from 'axios';
import { ApiService } from 'v2/services/ApiService';
import { CRYPTO_SCAM_DB_BASE_URL } from './constants';
import { CryptoScamDBInfoResponse, CryptoScamDBNoInfoResponse } from './types';

export default class CryptoScamDBService {
  public static instantiated = false;
  public static instance = new CryptoScamDBService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: CRYPTO_SCAM_DB_BASE_URL,
    timeout: 5000
  });

  constructor() {
    if (CryptoScamDBService.instantiated) {
      throw new Error(`CryptoScamDBService has already been instantiated.`);
    } else {
      CryptoScamDBService.instantiated = true;
    }
  }

  public check = async (address: string) => {
    const { data } = await this.service
      .get<CryptoScamDBNoInfoResponse | CryptoScamDBInfoResponse>(`check/${address}`)
      .catch();
    return data;
  };
}
