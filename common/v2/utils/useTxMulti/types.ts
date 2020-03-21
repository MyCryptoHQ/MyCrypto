import { ValuesType } from 'utility-types';
import { TransactionResponse } from 'ethers/providers';

import { Network, TAction, TUuid, ITxStatus, StoreAccount, ITxObject } from 'v2/types';
import { TxMultiReducer } from './reducer';

export interface TxParcel {
  readonly label?: string; // name of transaction eg. 'Allowance transaction'
  readonly _uuid?: TUuid;
  readonly status: ITxStatus;
  readonly account?: StoreAccount;
  readonly txRaw?: ITxObject;
  readonly txHash?: string;
  readonly txReceipt?: TransactionResponse;
}

export interface TxMultiState {
  readonly _isInitialized: boolean;
  readonly _currentTxIdx: number;
  readonly canYield: boolean;
  readonly isSubmitting: boolean;
  readonly transactions: TxParcel[];
  readonly currentTx?: TxParcel;
  readonly account?: Account;
  readonly network?: Network;
  readonly error?: Error;
}

export type TxMultiAction = TAction<ValuesType<typeof TxMultiReducer>, any>;
