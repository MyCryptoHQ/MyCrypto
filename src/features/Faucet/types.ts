import { ITxData, ITxGasLimit, ITxGasPrice, ITxHash, TAddress } from '@types';

interface ITxFaucetResultV1 {
  chainId: number;
  data: ITxData;
  from: TAddress;
  gasLimit: ITxGasLimit;
  gasPrice: ITxGasPrice;
  hash: ITxHash;
  network: string;
  nonce: number;
  to: TAddress;
  value: string;
}

interface ITxFaucetResultV2 {
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

export type ITxFaucetResult = ITxFaucetResultV1 | ITxFaucetResultV2;

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
