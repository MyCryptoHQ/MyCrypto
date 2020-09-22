import {
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxHash,
  ITxNonce,
  ITxStatus,
  ITxToAddress,
  ITxType,
  ITxValue,
  TAddress
} from '@types';

export interface ITxHistoryApiResponse {
  readonly blockNumber?: string; // Hex
  readonly data: ITxData;
  readonly erc20Transfers?: ITxHistoryERC20Transfer[];
  readonly from: ITxFromAddress;
  readonly gasLimit: ITxGasLimit; // Hex
  readonly gasPrice: ITxGasPrice; // Hex
  readonly gasUsed?: string; // Hex
  readonly hash: ITxHash;
  readonly nonce: ITxNonce; // Hex
  readonly recipientAddress: TAddress;
  readonly status: ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED | ITxStatus.UNKNOWN;
  readonly timestamp?: number;
  readonly to: ITxToAddress;
  readonly value: ITxValue; // Hex

  readonly txType: ITxType;
}

export interface ITxHistoryERC20Transfer {
  readonly from: TAddress;
  readonly to: TAddress;
  readonly contractAddress: TAddress;
  readonly amount: string; // Hex
}
