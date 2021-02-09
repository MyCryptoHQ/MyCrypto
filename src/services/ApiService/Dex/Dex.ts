import { AddressZero } from '@ethersproject/constants';
import axios, { AxiosInstance } from 'axios';

import {
  DEFAULT_ASSET_DECIMAL,
  DEFAULT_NETWORK_CHAINID,
  DEX_BASE_URL,
  DEX_FEE_RECIPIENT,
  MYC_DEX_COMMISSION_RATE
} from '@config';
import { formatApproveTx } from '@helpers';
import {
  ISwapAsset,
  ITxGasLimit,
  ITxGasPrice,
  ITxObject,
  ITxType,
  ITxValue,
  TAddress,
  TTicker
} from '@types';
import { addHexPrefix, baseToConvertedUnit, bigify, inputGasLimitToHex, toWei } from '@utils';

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

  public getTokenPriceFrom = async (from: ISwapAsset, to: ISwapAsset, fromAmount: string) => {
    return this.getTokenPrice(from, to, fromAmount);
  };

  public getTokenPriceTo = async (from: ISwapAsset, to: ISwapAsset, toAmount: string) => {
    return this.getTokenPrice(from, to, undefined, toAmount);
  };

  public getOrderDetailsFrom = async (from: ISwapAsset, to: ISwapAsset, fromAmount: string) =>
    this.getOrderDetails(from, to, fromAmount);

  public getOrderDetailsTo = async (from: ISwapAsset, to: ISwapAsset, toAmount: string) =>
    this.getOrderDetails(from, to, undefined, toAmount);

  private buildParams = (
    sellToken: ISwapAsset,
    buyToken: ISwapAsset,
    sellAmount?: string,
    buyAmount?: string
  ) => ({
    sellToken: sellToken.ticker,
    buyToken: buyToken.ticker,
    buyAmount: buyAmount
      ? toWei(buyAmount, buyToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
      : undefined,
    sellAmount: sellAmount
      ? toWei(sellAmount, sellToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
      : undefined
  });

  private makeApproval = (data: DexTrade) => ({
    ...formatApproveTx({
      contractAddress: data.sellTokenAddress,
      spenderAddress: data.allowanceTarget,
      hexGasPrice: addHexPrefix(bigify(data.gasPrice).toString(16)) as ITxGasPrice,
      baseTokenAmount: bigify(data.sellAmount)
    }),
    type: ITxType.APPROVAL
  });

  private getOrderDetails = async (
    sellToken: ISwapAsset,
    buyToken: ISwapAsset,
    sellAmount?: string,
    buyAmount?: string
  ): Promise<Partial<ITxObject & { type: ITxType }>[]> => {
    const { data }: { data: DexTrade } = await this.service.get('swap/v1/quote', {
      params: {
        ...this.buildParams(sellToken, buyToken, sellAmount, buyAmount),
        feeRecipient: DEX_FEE_RECIPIENT,
        buyTokenPercentageFee: MYC_DEX_COMMISSION_RATE
      }
    });

    const isMultiTx = data.allowanceTarget !== AddressZero;

    return [
      // Include the Approve transaction when necessary.
      // ie. any trade that is not an ETH/Token
      ...(isMultiTx ? [this.makeApproval(data)] : []),
      formatTradeTx({
        to: data.to,
        data: data.data,
        gasPrice: addHexPrefix(bigify(data.gasPrice).toString(16)) as ITxGasPrice,
        gasLimit: inputGasLimitToHex(data.gas),
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

      const { data } = await this.service.get('swap/v1/price', {
        params: {
          ...this.buildParams(sellToken, buyToken, sellAmount, buyAmount),
          feeRecipient: DEX_FEE_RECIPIENT,
          buyTokenPercentageFee: MYC_DEX_COMMISSION_RATE
        },
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        })
      });

      return {
        price: bigify(data.price),
        buyAmount: bigify(
          baseToConvertedUnit(data.buyAmount, buyToken.decimal || DEFAULT_ASSET_DECIMAL)
        ),
        sellAmount: bigify(
          baseToConvertedUnit(data.sellAmount, sellToken.decimal || DEFAULT_ASSET_DECIMAL)
        ),
        tradeGasLimit: addHexPrefix(bigify(data.gas).toString(16)) as ITxGasLimit,
        gasPrice: addHexPrefix(bigify(data.gasPrice).toString(16)) as ITxGasPrice,
        expiration: data.orders[0].expirationTimeSeconds,
        approvalTx: data.allowanceTarget !== AddressZero ? this.makeApproval(data) : undefined
      };
    } catch (e) {
      if (axios.isCancel(e)) {
        e.isCancel = true;
      }
      throw e;
    }
  };
}

export const formatTradeTx = ({
  to,
  data,
  value,
  gasPrice,
  gasLimit
}: Partial<ITxObject>): Partial<ITxObject & { type: ITxType }> => {
  return {
    to,
    data,
    value: addHexPrefix(bigify(value || '0').toString(16)) as ITxValue,
    chainId: DEFAULT_NETWORK_CHAINID,
    gasPrice,
    gasLimit,
    type: ITxType.SWAP
  };
};
