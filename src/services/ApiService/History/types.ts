import { ITxStatus, TAddress, ITxHash, ITxType } from '@types';

export interface ITxHistoryApiResponse {
  readonly blockNumber?: string; // Hex
  readonly data: string;
  readonly erc20Transfers?: ITxHistoryERC20Transfer[];
  readonly from: TAddress;
  readonly gasLimit: string; // Hex
  readonly gasPrice: string; // Hex
  readonly gasUsed?: string; // Hex
  readonly hash: ITxHash;
  readonly nonce: string; // Hex
  readonly recipientAddress: TAddress;
  readonly status: ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED | ITxStatus.UNKNOWN;
  readonly timestamp?: number;
  readonly to: TAddress;
  readonly value: string; // Hex

  readonly txType: ITxType;
}

export interface ITxHistoryERC20Transfer {
  readonly from: TAddress;
  readonly to: TAddress;
  readonly contractAddress: TAddress;
  readonly amount: string; // Hex
}
