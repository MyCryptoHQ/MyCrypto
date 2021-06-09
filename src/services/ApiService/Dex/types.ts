import { ITxData, ITxToAddress, ITxValue, TAddress } from '@types';

export interface DexTrade {
  price: string;
  to: ITxToAddress;
  value: ITxValue;
  gas: string; // Wei
  data: ITxData;
  gasPrice: string; // Wei
  allowanceTarget: TAddress;
  sellAmount: string; // Wei
  buyAmount: string; // Wei
  buyTokenAddress: TAddress;
  sellTokenAddress: TAddress;
}
