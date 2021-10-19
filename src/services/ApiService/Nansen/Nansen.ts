import { AxiosInstance } from 'axios';

import { NANSEN_API } from '@config';
import { ApiService } from '@services/ApiService';

import { NansenServiceResponse } from './types';

export default abstract class NansenService {
  public static check = async (address: string): Promise<NansenServiceResponse | null> => {
    try {
      const { data } = await NansenService.service.post<NansenServiceResponse>('/', { address });
      return data;
    } catch (e) {
      if (e?.response?.status === 404) {
        return { result: { name: 'Unknown', labels: [] } };
      }
      console.debug('[Nansen]: Fetching data from Nansen failed: ', e);
      return null;
    }
  };

  private static service: AxiosInstance = ApiService.generateInstance({
    baseURL: NANSEN_API,
    timeout: 15000
  });
}
