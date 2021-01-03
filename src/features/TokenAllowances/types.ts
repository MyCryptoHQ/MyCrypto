import {
  ExtendedAsset,
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxHash,
  Network,
  TAddress
} from '@types';

export interface ITxTokenAllowanceRevokeResult {
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

export interface TokenAllowancesState {
  step: number;
  txResult?: ITxTokenAllowanceRevokeResult;
  error?: string;
  loading: boolean;
}

export interface MyTokensProps {
  address: string;
  assets: ExtendedAsset[];
  network: Network | undefined;
}

export interface IAssetTableBody {
  ticker: string;
  name: string;
  contractAddress: string;
}

export interface IFormattedLogEntry {
  tokenContract: string;
  decimals: number;
  spender: string;
  allowance: string;
  blockNumber: number;
}
