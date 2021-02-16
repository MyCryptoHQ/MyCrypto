import { AddressZero } from '@ethersproject/constants';
import axios, { AxiosInstance } from 'axios';

import {
  DEFAULT_ASSET_DECIMAL,
  DEFAULT_NETWORK_CHAINID,
  DEX_BASE_URL,
  DEX_FEE_RECIPIENT,
  DEX_TRADE_EXPIRATION,
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
import { addHexPrefix, baseToConvertedUnit, bigify, toWei } from '@utils';

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

  public getOrderDetailsFrom = async (
    account: string | null,
    from: ISwapAsset,
    to: ISwapAsset,
    fromAmount: string
  ) => this.getOrderDetails(account, from, to, fromAmount);

  public getOrderDetailsTo = async (
    account: string | null,
    from: ISwapAsset,
    to: ISwapAsset,
    toAmount: string
  ) => this.getOrderDetails(account, from, to, undefined, toAmount);

  private getOrderDetails = async (
    account: string | null,
    sellToken: ISwapAsset,
    buyToken: ISwapAsset,
    sellAmount?: string,
    buyAmount?: string
  ) => {
    if (cancel) {
      cancel();
    }

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
        buyTokenPercentageFee: MYC_DEX_COMMISSION_RATE,
        takerAddress: account ? account : undefined
      },
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    });

    const approvalTx =
      data.allowanceTarget !== AddressZero
        ? {
            ...formatApproveTx({
              contractAddress: data.sellTokenAddress,
              spenderAddress: data.allowanceTarget,
              hexGasPrice: addHexPrefix(bigify(data.gasPrice).toString(16)) as ITxGasPrice,
              baseTokenAmount: bigify(data.sellAmount),
              chainId: DEFAULT_NETWORK_CHAINID
            }),
            type: ITxType.APPROVAL
          }
        : undefined;

    const tradeGasLimit = addHexPrefix(bigify(data.gas).toString(16)) as ITxGasLimit;

    return {
      price: bigify(data.price),
      buyAmount: bigify(
        baseToConvertedUnit(data.buyAmount, buyToken.decimal || DEFAULT_ASSET_DECIMAL)
      ),
      sellAmount: bigify(
        baseToConvertedUnit(data.sellAmount, sellToken.decimal || DEFAULT_ASSET_DECIMAL)
      ),
      gasPrice: addHexPrefix(bigify(data.gasPrice).toString(16)) as ITxGasPrice,
      // @todo: Better way to calculate expiration? This is what matcha.xyz does
      expiration: Date.now() / 1000 + DEX_TRADE_EXPIRATION,
      approvalTx,
      tradeGasLimit,
      tradeTx: formatTradeTx({
        to: data.to,
        data: data.data,
        gasPrice: addHexPrefix(bigify(data.gasPrice).toString(16)) as ITxGasPrice,
        gasLimit: tradeGasLimit,
        value: data.value
      })
    };
  };
}

export const formatTradeTx = ({
  to,
  data,
  value,
  gasPrice,
  gasLimit
}: Pick<ITxObject, 'to' | 'data' | 'value' | 'gasPrice' | 'gasLimit'>) => {
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
