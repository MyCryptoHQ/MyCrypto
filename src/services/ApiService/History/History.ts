import { AxiosInstance } from 'axios';

import { HISTORY_API } from '@config';
import { TAddress } from '@types';

import { default as ApiService } from '../ApiService';
import { ITxHistoryApiResponse } from './types';

let instantiated = false;

export default class HistoryService {
  public static instance = new HistoryService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: HISTORY_API
  });

  constructor() {
    if (instantiated) {
      throw new Error(`HistoryService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getHistory = async (addresses: TAddress[]): Promise<ITxHistoryApiResponse[] | null> => {
    try {
      const { data } = await this.service.post('', { addresses });
      return data;
    } catch (e) {
      console.debug('[HistoryService]: Fetching history failed: ', e);
      return null;
    }
  };
}
