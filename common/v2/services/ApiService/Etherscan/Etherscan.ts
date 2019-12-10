import { AxiosInstance } from 'axios';
import { default as ApiService } from '../ApiService';
import { ETHERSCAN_API_URLS } from './constants';
import { NetworkId } from 'v2/types';

let instantiated: boolean = false;
export default class EtherscanService {
  public static instance = new EtherscanService();
  private service: AxiosInstance = ApiService.generateInstance();

  constructor() {
    if (instantiated) {
      throw new Error(`Ethereum service has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getContractAbi = async (address: string, networkId: NetworkId) => {
    try {
      const params = {
        module: 'contract',
        action: 'getAbi',
        address
      };

      const { data } = await this.service.get(ETHERSCAN_API_URLS[networkId]!, { params });

      if (data.status === '1') {
        return data.result;
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  };
}
