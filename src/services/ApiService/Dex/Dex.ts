import { AddressZero } from '@ethersproject/constants';
import axios, { AxiosInstance } from 'axios';

import {
  DEFAULT_ASSET_DECIMAL,
  DEX_BASE_URLS,
  DEX_FEE_RECIPIENT,
  DEX_TRADE_EXPIRATION,
  MYC_DEX_COMMISSION_RATE
} from '@config';
import { formatApproveTx as formatApproveTxFunc, makeTxFromForm } from '@helpers';
import {
  fetchUniversalGasPriceEstimate,
  UniversalGasEstimationResult
} from '@services/ApiService/Gas';
import {
  Bigish,
  ISwapAsset,
  ITxData,
  ITxGasLimit,
  ITxType,
  ITxValue,
  Network,
  NetworkId,
  StoreAccount,
  TAddress,
  TTicker
} from '@types';
import { addHexPrefix, baseToConvertedUnit, bigify, inputGasPriceToHex, toWei } from '@utils';

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
    account: StoreAccount | undefined,
    from: ISwapAsset,
    to: ISwapAsset,
    fromAmount: string
  ) => this.getOrderDetails(network, account, from, to, fromAmount);

  public getOrderDetailsTo = async (
    network: Network,
    account: StoreAccount | undefined,
    from: ISwapAsset,
    to: ISwapAsset,
    toAmount: string
  ) => this.getOrderDetails(network, account, from, to, undefined, toAmount);

  private getOrderDetails = async (
    network: Network,
    account: StoreAccount | undefined,
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
        sellToken: sellToken.contractAddress ?? sellToken.ticker,
        buyToken: buyToken.contractAddress ?? buyToken.ticker,
        buyAmount: buyAmount
          ? toWei(buyAmount, buyToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
          : undefined,
        sellAmount: sellAmount
          ? toWei(sellAmount, sellToken.decimal || DEFAULT_ASSET_DECIMAL).toString()
          : undefined,
        feeRecipient: DEX_FEE_RECIPIENT,
        buyTokenPercentageFee: MYC_DEX_COMMISSION_RATE,
        affiliateAddress: DEX_FEE_RECIPIENT,
        takerAddress: account?.address,
        skipValidation: true
      },
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    });

    const gasResult = await fetchUniversalGasPriceEstimate(network, account);
    const { estimate: gas } = gasResult;

    const gasPrice = gas.gasPrice ?? gas.maxFeePerGas;

    const approvalTx =
      data.allowanceTarget !== AddressZero
        ? formatApproveTx({
            account: account!,
            contractAddress: data.sellTokenAddress,
            spenderAddress: data.allowanceTarget,
            baseTokenAmount: bigify(data.sellAmount),
            network,
            gas
          })
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
      gasPrice: inputGasPriceToHex(gasPrice),
      // @todo: Better way to calculate expiration? This is what matcha.xyz does
      expiration: Date.now() / 1000 + DEX_TRADE_EXPIRATION,
      approvalTx,
      tradeGasLimit,
      gas: gasResult,
      tradeTx: formatTradeTx({
        account: account!,
        to: data.to,
        data: data.data as ITxData,
        gas,
        value: data.value,
        network,
        buyToken
      })
    };
  };
}

export const formatApproveTx = ({
  account,
  contractAddress,
  baseTokenAmount,
  spenderAddress,
  gas,
  network
}: {
  account: StoreAccount;
  contractAddress: TAddress;
  baseTokenAmount: Bigish;
  spenderAddress: TAddress;
  gas: UniversalGasEstimationResult;
  network: Network;
}) => {
  const tx = formatApproveTxFunc({
    contractAddress,
    baseTokenAmount,
    spenderAddress,
    form: {
      network,
      gasPrice: gas.gasPrice ?? '',
      maxFeePerGas: gas.maxFeePerGas ?? '',
      maxPriorityFeePerGas: gas.maxPriorityFeePerGas ?? '',
      gasLimit: '',
      address: '',
      nonce: '',
      account
    }
  });

  return {
    ...tx,
    txType: ITxType.APPROVAL
  };
};

export const formatTradeTx = ({
  account,
  to,
  data,
  value,
  gas,
  network,
  buyToken
}: {
  account: StoreAccount;
  to: TAddress;
  data: ITxData;
  value: ITxValue;
  gas: UniversalGasEstimationResult;
  network: Network;
  buyToken: ISwapAsset;
}) => {
  const { gasLimit, nonce, value: unusedValue, from, ...tx } = makeTxFromForm(
    {
      network,
      gasPrice: gas.gasPrice ?? '',
      maxFeePerGas: gas.maxFeePerGas ?? '',
      maxPriorityFeePerGas: gas.maxPriorityFeePerGas ?? '',
      gasLimit: '',
      address: to,
      nonce: '',
      account
    },
    '0',
    data
  );

  return {
    ...tx,
    value: addHexPrefix(bigify(value || '0').toString(16)) as ITxValue,
    txType: ITxType.SWAP,
    metadata: { receivingAsset: buyToken.uuid }
  };
};
