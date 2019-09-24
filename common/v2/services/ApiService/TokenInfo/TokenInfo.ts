import { AxiosInstance } from 'axios';

import { default as ApiService } from '../ApiService';
import { TOKEN_INFO_URL } from 'v2/config';

let instantiated: boolean = false;

export default class TokenInfoService {
  public static instance = new TokenInfoService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: TOKEN_INFO_URL
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
