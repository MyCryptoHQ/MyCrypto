import { AddressZero } from '@ethersproject/constants';
import axios, { AxiosInstance } from 'axios';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import {
  DEFAULT_ASSET_DECIMAL,
  DEX_BASE_URL,
  DEX_FEE_RECIPIENT,
  MYC_DEX_COMMISSION_RATE
} from '@config';
import { ERC20 } from '@services/EthService';
import {
  Bigish,
  ISwapAsset,
  ITxData,
  ITxObject,
  ITxType,
  ITxValue,
  TAddress,
  TTicker
} from '@types';
import { bigify, toWei } from '@utils';

import { default as ApiService } from '../ApiService';
import { DexTrade } from './types';

let instantiated = false;

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
  /**public static defaultParams = {
    discluded: 'radar-relay',
    dex: 'all'
  };**/

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
    const {
      data: { records: tokenList }
    }: { data: { records: DexAsset[] } } = await this.service.get('swap/v1/tokens');
    return tokenList;
  };

  public getTokenPriceFrom = async (
    from: ISwapAsset,
    to: ISwapAsset,
    fromAmount: string
  ): Promise<{ costBasis: Bigish; price: Bigish }> => {
    const { costBasis, tokenPrices: price } = await this.getTokenPrice(from, to, fromAmount);
    return { costBasis: bigify(costBasis), price: bigify(price) };
  };

  public getTokenPriceTo = async (
    from: ISwapAsset,
    to: ISwapAsset,
    toAmount: string
  ): Promise<{ costBasis: Bigish; price: Bigish }> => {
    const { costBasis, tokenPrices: price } = await this.getTokenPrice(
      from,
      to,
      undefined,
      toAmount
    );
    return { costBasis: bigify(costBasis), price: bigify(price) };
  };

  public getOrderDetailsFrom = async (from: ISwapAsset, to: ISwapAsset, fromAmount: string) =>
    this.getOrderDetails(from, to, fromAmount);

  public getOrderDetailsTo = async (from: ISwapAsset, to: ISwapAsset, toAmount: string) =>
    this.getOrderDetails(from, to, undefined, toAmount);

  private getOrderDetails = async (
    sellToken: ISwapAsset,
    buyToken: ISwapAsset,
    sellAmount?: string,
    buyAmount?: string
  ): Promise<Partial<ITxObject & { type: ITxType }>[]> => {
    const { data }: { data: DexTrade } = await this.service.get('swap/v1/quote', {
      params: {
        sellToken: sellToken.ticker,
        buyToken: buyToken.ticker,
        buyAmount: buyAmount
          ? toWei(buyAmount, buyToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
          : undefined,
        sellAmount: sellAmount
          ? toWei(sellAmount, sellToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
          : undefined,
        feeRecipient: DEX_FEE_RECIPIENT,
        buyTokenPercentageFee: MYC_DEX_COMMISSION_RATE
      }
    });

    const isMultiTx = data.allowanceTarget !== AddressZero;

    return [
      // Include the Approve transaction when necessary.
      // ie. any trade that is not an ETH/Token
      ...(isMultiTx
        ? [
            formatApproveTx({
              to: data.sellTokenAddress,
              spender: data.allowanceTarget!,
              value: data.sellAmount as ITxValue
            })
          ]
        : []),
      formatTradeTx({
        to: data.to,
        data: data.data,
        value: data.value
      })
    ];
  };

  private getTokenPrice = async (
    sellToken: ISwapAsset,
    buyToken: ISwapAsset,
    sellAmount?: string,
    buyAmount?: string
  ) => {
    try {
      if (cancel) {
        cancel();
      }

      // IS IT REALLY NEEDED TO DO THE REQUEST TWICE??
      const { data: costBasis } = await this.service.get('swap/v1/price', {
        params: {
          sellToken: sellToken.ticker,
          buyToken: buyToken.ticker,
          buyAmount: buyAmount
            ? toWei('0.01', buyToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
            : undefined,
          sellAmount: sellAmount
            ? toWei('0.01', sellToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
            : undefined
        },
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      });

      const { data: tokenPrices } = await this.service.get('swap/v1/price', {
        params: {
          sellToken: sellToken.ticker,
          buyToken: buyToken.ticker,
          buyAmount: buyAmount
            ? toWei(buyAmount, buyToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
            : undefined,
          sellAmount: sellAmount
            ? toWei(sellAmount, sellToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
            : undefined
          /**feeRecipient: DEX_FEE_RECIPIENT,
          buyTokenPercentageFee: MYC_DEX_COMMISSION_RATE**/
        },
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      });

      return { costBasis: costBasis.price, tokenPrices: tokenPrices.price };
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
export const formatApproveTx = ({
  to,
  spender,
  value
}: Partial<ITxObject> & { spender: TAddress }): Partial<ITxObject & { type: ITxType }> => {
  // [spender, amount]. Spender is the contract the user needs to authorize.
  // It's value is also available in the API response obj `data.metadata.input.spender`
  const data = ERC20.approve.encodeInput({ _spender: spender, _value: value });

  return {
    to,
    data: data as ITxData,
    chainId: 1,
    value: addHexPrefix(new BN('0').toString()) as ITxValue,
    type: ITxType.APPROVAL
  };
};

export const formatTradeTx = ({
  to,
  data,
  value
}: Partial<ITxObject>): Partial<ITxObject & { type: ITxType }> => {
  return {
    to,
    data,
    value: addHexPrefix(new BN(value || '0').toString(16)) as ITxValue,
    chainId: 1,
    type: ITxType.SWAP
  };
};
