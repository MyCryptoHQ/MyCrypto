import { AxiosInstance } from 'axios';
import { default as ApiService } from '../ApiService';
import { ETHERSCAN_API_MAX_LIMIT_REACHED_TEXT, ETHERSCAN_API_URLS } from './constants';
import { NetworkId } from '@types';
import { GetBalanceResponse, GetLastTxResponse } from './types';

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

  public getBalance = async (
    address: string,
    networkId: NetworkId = 'Ethereum'
  ): Promise<GetBalanceResponse | null> => {
    if (!Object.keys(ETHERSCAN_API_URLS).includes(networkId)) {
      throw new Error(
        `Not supported networkId. Supported: ${Object.keys(ETHERSCAN_API_URLS).join(', ')}`
      );
    }

    const params = {
      module: 'account',
      action: 'balance',
      tag: 'latest',
      address,
      apiKey: ''
    };

    const { data } = await this.service.get(ETHERSCAN_API_URLS[networkId]!, { params });

    if (data.status === '1') {
      return data;
    } else if (data.status === '0' && data.result === ETHERSCAN_API_MAX_LIMIT_REACHED_TEXT) {
      // @todo: Remove after proxy
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.getBalance(address, networkId);
    }
    return null;
  };

  public getLastTx = async (
    address: string,
    networkId: NetworkId = 'Ethereum'
  ): Promise<GetLastTxResponse | null> => {
    if (!Object.keys(ETHERSCAN_API_URLS).includes(networkId)) {
      throw new Error(
        `Not supported networkId. Supported: '${Object.keys(ETHERSCAN_API_URLS).join(', ')}'`
      );
    }

    const params = {
      module: 'account',
      action: 'tokentx',
      startblock: 0,
      endblock: 99999999,
      address,
      sort: 'desc',
      apiKey: ''
    };

    const { data } = await this.service.get(ETHERSCAN_API_URLS[networkId]!, { params });

    if (data.status === '1') {
      return data;
    } else if (data.status === '0' && data.result === ETHERSCAN_API_MAX_LIMIT_REACHED_TEXT) {
      // @todo: Remove after proxy
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.getLastTx(address, networkId);
    }
    return null;
  };
}
