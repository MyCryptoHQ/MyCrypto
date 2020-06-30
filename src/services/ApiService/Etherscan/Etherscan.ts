import { AxiosInstance } from 'axios';
import { default as ApiService } from '../ApiService';
import { ETHERSCAN_API_URLS } from './constants';
import { NetworkId } from '@types';
import { GetBalanceResponse, GetTxResponse, GetTokenTxResponse } from './types';

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

    try {
      const params = {
        module: 'account',
        action: 'balance',
        tag: 'latest',
        address
      };

      const { data } = await this.service.get(ETHERSCAN_API_URLS[networkId]!, { params });

      if (data.status === '1') {
        return data;
      }
      return null;
    } catch (e) {
      throw e;
    }
  };

  public getTokenTransactions = async (
    address: string,
    networkId: NetworkId = 'Ethereum'
  ): Promise<GetTokenTxResponse | null> => {
    if (!Object.keys(ETHERSCAN_API_URLS).includes(networkId)) {
      throw new Error(
        `Not supported networkId. Supported: '${Object.keys(ETHERSCAN_API_URLS).join(', ')}'`
      );
    }

    try {
      const params = {
        module: 'account',
        action: 'tokentx',
        address,
        sort: 'desc'
      };

      const { data } = await this.service.get(ETHERSCAN_API_URLS[networkId]!, { params });

      if (data.status === '1' || data.message === 'No transactions found') {
        return data;
      }
      return null;
    } catch (e) {
      throw e;
    }
  };

  public getTransactions = async (
    address: string,
    networkId: NetworkId = 'Ethereum'
  ): Promise<GetTxResponse | null> => {
    if (!Object.keys(ETHERSCAN_API_URLS).includes(networkId)) {
      throw new Error(
        `Not supported networkId. Supported: '${Object.keys(ETHERSCAN_API_URLS).join(', ')}'`
      );
    }

    try {
      const params = {
        module: 'account',
        action: 'txlist',
        address,
        sort: 'desc'
      };

      const { data } = await this.service.get(ETHERSCAN_API_URLS[networkId]!, { params });

      if (data.status === '1' || data.message === 'No transactions found') {
        return data;
      }
      return null;
    } catch (e) {
      throw e;
    }
  };
}
