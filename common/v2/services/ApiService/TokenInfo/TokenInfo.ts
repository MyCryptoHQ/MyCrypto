import { AxiosInstance } from 'axios';

import { default as ApiService } from '../ApiService';

let instantiated: boolean = false;

const apiUrl = 'https://api.mycryptoapi.com/tokens';

export default class TokenInfoService {
  public static instance = new TokenInfoService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: apiUrl
  });

  constructor() {
    if (instantiated) {
      throw new Error(`TokenInfoService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getTokensInfo = async (contractAddresses: string[]) => {
    const params = new URLSearchParams();
    contractAddresses.forEach(address => params.append('contractAddress', address));

    try {
      const response = await this.service.get('', { params });
      return response.data;
    } catch (e) {
      throw e;
    }
  };
}
