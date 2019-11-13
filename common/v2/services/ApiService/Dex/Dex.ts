import axios, { AxiosInstance } from 'axios';

import { default as ApiService } from '../ApiService';
import { TSymbol } from 'v2/types';
import { DEXAG_PROXY_CONTRACT } from 'v2/config';

const DEX_BASE_URL = 'https://api.dex.ag/';

let instantiated: boolean = false;

const CancelToken = axios.CancelToken;
let cancel: any = null;

export default class DexService {
  public static instance = new DexService();

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

  public getTokenList = async () => {
    try {
      const { data: tokenList } = await this.service.get('token-list-full');

      return tokenList;
    } catch (e) {
      throw e;
    }
  };

  public getTokenPriceFrom = async (from: TSymbol, to: TSymbol, fromAmount: string) =>
    this.getTokenPrice(from, to, fromAmount);

  public getTokenPriceTo = async (from: TSymbol, to: TSymbol, toAmount: string) =>
    this.getTokenPrice(from, to, undefined, toAmount);

  public getOrderDetailsFrom = async (from: TSymbol, to: TSymbol, fromAmount: string) =>
    this.getOrderDetails(from, to, fromAmount);

  public getOrderDetailsTo = async (from: TSymbol, to: TSymbol, toAmount: string) =>
    this.getOrderDetails(from, to, undefined, toAmount);

  private getOrderDetails = async (
    from: TSymbol,
    to: TSymbol,
    fromAmount?: string,
    toAmount?: string
  ) => {
    try {
      const params = {
        from,
        to,
        fromAmount,
        toAmount,
        dex: 'best',
        proxy: DEXAG_PROXY_CONTRACT
      };
      const { data: orderDetails } = await this.service.get('trade', { params });

      return orderDetails;
    } catch (e) {
      throw e;
    }
  };

  private getTokenPrice = async (
    from: TSymbol,
    to: TSymbol,
    fromAmount?: string,
    toAmount?: string
  ) => {
    try {
      if (cancel) {
        cancel();
      }

      const params = {
        from,
        to,
        fromAmount,
        toAmount,
        dex: 'all'
      };
      const { data: tokenPrices } = await this.service.get('price', {
        params,
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      });

      return tokenPrices[0].price;
    } catch (e) {
      if (axios.isCancel(e)) {
        e.isCancel = true;
      }
      throw e;
    }
  };
}
