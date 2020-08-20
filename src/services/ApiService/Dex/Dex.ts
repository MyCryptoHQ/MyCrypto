import { addHexPrefix } from 'ethereumjs-util';
import BN from 'bn.js';
import axios, { AxiosInstance } from 'axios';

import { TTicker, ITxObject, TAddress } from '@types';
import { DEXAG_MYC_TRADE_CONTRACT, DEXAG_MYC_HANDLER_CONTRACT, DEX_BASE_URL } from '@config';
import { ERC20 } from '@services/EthService';

import { default as ApiService } from '../ApiService';
import { DexTrade } from './types';

let instantiated: boolean = false;

const CancelToken = axios.CancelToken;
let cancel: any = null;

export interface DexAsset {
  address: TAddress;
  decimals: number;
  name: string;
  symbol: TTicker;
}

export default class DexService {
  public static instance = new DexService();
  public static defaultParams = {
    discluded: 'radar-relay',
    dex: 'all'
  };

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: DEX_BASE_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`DexService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getTokenList = async (): Promise<DexAsset[]> => {
    try {
      const { data: tokenList }: { data: DexAsset[] } = await this.service.get('token-list-full');

      return tokenList;
    } catch (e) {
      throw e;
    }
  };

  public getTokenPriceFrom = async (
    from: TTicker,
    to: TTicker,
    fromAmount: string
  ): Promise<{ costBasis: number; price: number }> => {
    const { costBasis, tokenPrices: price } = await this.getTokenPrice(from, to, fromAmount);
    return { costBasis: parseFloat(costBasis), price: parseFloat(price) };
  };

  public getTokenPriceTo = async (
    from: TTicker,
    to: TTicker,
    toAmount: string
  ): Promise<{ costBasis: number; price: number }> => {
    const { costBasis, tokenPrices: price } = await this.getTokenPrice(
      from,
      to,
      undefined,
      toAmount
    );
    return { costBasis: parseFloat(costBasis), price: parseFloat(price) };
  };

  public getOrderDetailsFrom = async (from: TTicker, to: TTicker, fromAmount: string) =>
    this.getOrderDetails(from, to, fromAmount);

  public getOrderDetailsTo = async (from: TTicker, to: TTicker, toAmount: string) =>
    this.getOrderDetails(from, to, undefined, toAmount);

  private getOrderDetails = async (
    from: TTicker,
    to: TTicker,
    fromAmount?: string,
    toAmount?: string
  ): Promise<Partial<ITxObject>[]> => {
    try {
      const params = {
        ...DexService.defaultParams,
        from,
        to,
        fromAmount,
        toAmount,
        dex: 'ag',
        proxy: DEXAG_MYC_TRADE_CONTRACT
      };
      const { data }: { data: DexTrade } = await this.service.get('trade', {
        params
      });
      const isMultiTx = !!(data.metadata && data.metadata.input);

      return [
        // Include the Approve transaction when necessary.
        // ie. any trade that is not an ETH/Token
        ...(isMultiTx
          ? [
              formatApproveTx({
                to: data.metadata.input.address,
                value: data.metadata.input.amount
              })
            ]
          : []),
        formatTradeTx({
          to: data.trade.to,
          data: data.trade.data,
          value: data.trade.value
        })
      ];
    } catch (e) {
      throw e;
    }
  };

  private getTokenPrice = async (
    from: TTicker,
    to: TTicker,
    fromAmount?: string,
    toAmount?: string
  ) => {
    try {
      if (cancel) {
        cancel();
      }

      const params = {
        ...DexService.defaultParams,
        from,
        to,
        fromAmount,
        toAmount
      };
      const { data: costBasis } = await this.service.get('price', {
        params: {
          ...params,
          toAmount: toAmount ? '0.01' : undefined,
          fromAmount: fromAmount ? '0.01' : undefined
        },
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      });
      const { data: tokenPrices } = await this.service.get('price', {
        params,
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      });

      return { costBasis: costBasis[0].price, tokenPrices: tokenPrices[0].price };
    } catch (e) {
      if (axios.isCancel(e)) {
        e.isCancel = true;
      }
      throw e;
    }
  };
}

// Create a transaction that approves the MYC_HANDLER_CONTRACT in order for the TRADE_CONTRACT
// to execute. Example: https://docs.dex.ag/api/using-the-api-with-node.js
export const formatApproveTx = ({ to, value }: Partial<ITxObject>): Partial<ITxObject> => {
  // [spender, amount]. Spender is the contract the user needs to authorize.
  // It's value is also available in the API response obj `data.metadata.input.spender`
  const data = ERC20.approve.encodeInput({ _spender: DEXAG_MYC_HANDLER_CONTRACT, _value: value });

  return {
    to,
    data,
    chainId: 1,
    value: addHexPrefix(new BN('0').toString())
  };
};

export const formatTradeTx = ({ to, data, value }: Partial<ITxObject>): Partial<ITxObject> => {
  return {
    to,
    data,
    value: addHexPrefix(new BN(value || '0').toString(16)),
    chainId: 1
  };
};
