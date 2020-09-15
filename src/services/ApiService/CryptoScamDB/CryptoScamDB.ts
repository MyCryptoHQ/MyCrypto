import { AxiosInstance } from 'axios';

import { ApiService } from '@services/ApiService';

import { CRYPTO_SCAM_DB_BASE_URL } from './constants';
import { CryptoScamDBInfoResponse, CryptoScamDBNoInfoResponse } from './types';

export default abstract class CryptoScamDBService {
  public static check = async (address: string) => {
    const { data } = await CryptoScamDBService.service
      .get<CryptoScamDBNoInfoResponse | CryptoScamDBInfoResponse>(`check/${address}`)
      .catch();
    return data;
  };

  private static service: AxiosInstance = ApiService.generateInstance({
    baseURL: CRYPTO_SCAM_DB_BASE_URL,
    timeout: 5000
  });
}
