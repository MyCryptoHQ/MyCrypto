import { ITxData, ITxGasLimit, ITxGasPrice, ITxToAddress, ITxValue, TAddress } from '@types';

export interface DexTrade {
  to: ITxToAddress;
  value: ITxValue;
  gas: ITxGasLimit;
  data: ITxData;
  gasPrice: ITxGasPrice;
  allowanceTarget?: TAddress;
  sellAmount: string; // Wei
  buyAmount: string; // Wei
  buyTokenAddress: TAddress;
  sellTokenAddress: TAddress;
}
