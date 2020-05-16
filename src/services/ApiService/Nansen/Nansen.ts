import { AxiosInstance } from 'axios';
import { ApiService } from '@services/ApiService';
import { NANSEN_API } from '@config';
import { NansenServiceResponse } from './types';

export default abstract class NansenService {
  public static check = async (address: string) => {
    const { data } = await NansenService.service
      .post<NansenServiceResponse>('/', { address })
      .catch();
    return data as NansenServiceResponse | null;
  };

  private static service: AxiosInstance = ApiService.generateInstance({
    baseURL: NANSEN_API,
    timeout: 10000
  });
}
