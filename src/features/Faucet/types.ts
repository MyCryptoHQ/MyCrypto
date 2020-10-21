import { ITxData, ITxGasLimit, ITxGasPrice, ITxHash, TAddress } from '@types';

export interface ITxFaucetResult {
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
