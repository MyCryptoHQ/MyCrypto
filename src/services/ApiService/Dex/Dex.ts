import { AddressZero } from '@ethersproject/constants';
import axios, { AxiosInstance } from 'axios';

import {
  DEFAULT_ASSET_DECIMAL,
  DEX_BASE_URLS,
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
  Network,
  NetworkId,
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

  private service: AxiosInstance = ApiService.generateInstance();

  constructor() {
    if (instantiated) {
      throw new Error(`DexService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  private getBaseURL = (network: NetworkId) => {
    return DEX_BASE_URLS[network];
  };

  public getTokenList = async (network: NetworkId): Promise<DexAsset[]> => {
    const {
      data: { records: tokenList }
    }: { data: { records: DexAsset[] } } = await this.service.get('swap/v1/tokens', {
      baseURL: this.getBaseURL(network)
    });
    return tokenList;
  };

  public getOrderDetailsFrom = async (
    network: Network,
    account: string | null,
    from: ISwapAsset,
    to: ISwapAsset,
    fromAmount: string
  ) => this.getOrderDetails(network, account, from, to, fromAmount);

  public getOrderDetailsTo = async (
    network: Network,
    account: string | null,
    from: ISwapAsset,
    to: ISwapAsset,
    toAmount: string
  ) => this.getOrderDetails(network, account, from, to, undefined, toAmount);

  private getOrderDetails = async (
    network: Network,
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
      baseURL: this.getBaseURL(network.id),
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
        takerAddress: account ? account : undefined,
        skipValidation: true
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
              chainId: network.chainId
            }),
            type: ITxType.APPROVAL
          }
        : undefined;

    const tradeGasLimit = addHexPrefix(
      bigify(data.gas).multipliedBy(1.2).integerValue(7).toString(16)
    ) as ITxGasLimit;

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
        value: data.value,
        chainId: network.chainId
      })
    };
  };
}

export const formatTradeTx = ({
  to,
  data,
  value,
  gasPrice,
  chainId
}: Pick<ITxObject, 'to' | 'data' | 'value' | 'gasPrice' | 'chainId'>) => {
  return {
    to,
    data,
    value: addHexPrefix(bigify(value || '0').toString(16)) as ITxValue,
    chainId,
    gasPrice,
    type: ITxType.SWAP
  };
};
