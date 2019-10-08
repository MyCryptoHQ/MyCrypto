import { AxiosInstance } from 'axios';

import { default as ApiService } from '../ApiService';
import { TSymbol } from 'v2/types';

const DEX_BASE_URL = 'https://api.dex.ag/';

let instantiated: boolean = false;

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

  public getTokenPriceFrom = async (from: TSymbol, to: TSymbol, fromAmount: number) =>
    this.getTokenPrice(from, to, fromAmount);

  public getTokenPriceTo = async (from: TSymbol, to: TSymbol, toAmount: number) =>
    this.getTokenPrice(from, to, undefined, toAmount);

  public getOrderDetailsFrom = async (from: TSymbol, to: TSymbol, fromAmount: number) =>
    this.getOrderDetails(from, to, fromAmount);

  public getOrderDetailsTo = async (from: TSymbol, to: TSymbol, toAmount: number) =>
    this.getOrderDetails(from, to, undefined, toAmount);

  private getOrderDetails = async (
    from: TSymbol,
    to: TSymbol,
    fromAmount?: number,
    toAmount?: number
  ) => {
    try {
      const params = {
        from,
        to,
        fromAmount,
        toAmount,
        dex: 'best'
        // TODO use proxy contract for fees (proxy param)
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
    fromAmount?: number,
    toAmount?: number
  ) => {
    try {
      const params = {
        from,
        to,
        fromAmount,
        toAmount,
        dex: 'all'
      };
      const { data: tokenPrices } = await this.service.get('price', { params });

      return tokenPrices[0].price;
    } catch (e) {
      throw e;
    }
  };
}
