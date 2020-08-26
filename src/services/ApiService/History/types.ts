import { ITxStatus, TAddress, ITxHash, ITxType } from '@types';

export interface ITxHistoryApiResponse {
  readonly blockNumber?: number;
  readonly erc20Transfers?: ITxHistoryERC20Transfer[];
  readonly from: TAddress;
  readonly gasLimit: number;
  readonly gasPrice: number;
  readonly gasUsed?: number;
  readonly hash: ITxHash;
  readonly nonce: number;
  readonly recipientAddress: TAddress;
  readonly status: ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED | ITxStatus.UNKNOWN;
  readonly timestamp?: number;
  readonly to: TAddress;
  readonly value: number;

  readonly txType: ITxType;

  // @todo: NOT PRESENT ATM
  //readonly confirmations?: number;
  //   readonly data: string;
}

export interface ITxHistoryERC20Transfer {
  readonly from: TAddress;
  readonly to: TAddress;
  readonly contractAddress: TAddress;
  readonly amount: number;
}
