import { ITxData, ITxGasLimit, ITxGasPrice, ITxHash, TAddress } from '@types';

export interface ITxFaucetResult {
  chainId: number;
  data: ITxData;
  from: TAddress;
  gasLimit: ITxGasLimit;
  maxFeePerGas: ITxGasPrice;
  maxPriorityFeePerGas: ITxGasPrice;
  hash: ITxHash;
  network: string;
  nonce: number;
  to: TAddress;
  value: string;
}

export interface FaucetState {
  step: number;
  challenge?: {
    id: string;
    challenge: string;
  };
  solution?: string;
  txResult?: ITxFaucetResult;
  error?: string;
  loading: boolean;
}
