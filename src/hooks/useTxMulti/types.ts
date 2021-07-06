import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';

import {
  ITxHash,
  ITxMetadata,
  ITxObject,
  ITxStatus,
  ITxType,
  Network,
  StoreAccount,
  TUuid
} from '@types';

export interface TxParcel {
  readonly _uuid: TUuid;
  readonly status: ITxStatus;
  readonly txRaw: ITxObject;
  readonly label?: string; // name of transaction eg. 'Allowance transaction'
  readonly txHash?: ITxHash;
  readonly txReceipt?: TransactionReceipt;
  readonly txResponse?: TransactionResponse;
  readonly txType?: ITxType;
  readonly minedAt?: number; // timestamp of block that included tx
  readonly metadata?: ITxMetadata;
}

export interface TxMultiState {
  readonly _isInitialized: boolean;
  readonly _currentTxIdx: number;
  readonly canYield: boolean;
  readonly isSubmitting: boolean;
  readonly transactions: TxParcel[];
  readonly currentTx?: TxParcel;
  readonly account?: StoreAccount;
  readonly network?: Network;
  readonly error?: Error;
}

export enum ActionTypes {
  INIT_REQUEST = 'INIT_REQUEST',
  INIT_SUCCESS = 'INIT_SUCCESS',
  INIT_FAILURE = 'INIT_FAILURE',

  PREPARE_TX_REQUEST = 'PREPARE_TX_REQUEST',
  PREPARE_TX_SUCCESS = 'PREPARE_TX_SUCCESS',
  PREPARE_TX_FAILURE = 'PREPARE_TX_FAILURE',

  SEND_TX_SUCCESS = 'SEND_TX_SUCCESS',
  SEND_TX_REQUEST = 'SEND_TX_REQUEST',
  SEND_TX_FAILURE = 'SEND_TX_FAILURE',

  CONFIRM_TX_SUCCESS = 'CONFIRM_TX_SUCCESS',
  CONFIRM_TX_REQUEST = 'CONFIRM_TX_REQUEST',
  CONFIRM_TX_FAILURE = 'CONFIRM_TX_FAILURE',

  HALT_FLOW = 'HALT_FLOW',
  RESET = 'RESET'
}

interface DefaultAction {
  type: ActionTypes;
  payload?: any;
  error?: boolean;
}

interface ARequest extends DefaultAction {
  type:
    | ActionTypes.INIT_REQUEST
    | ActionTypes.PREPARE_TX_REQUEST
    | ActionTypes.SEND_TX_REQUEST
    | ActionTypes.CONFIRM_TX_REQUEST
    | ActionTypes.HALT_FLOW
    | ActionTypes.RESET;
}
interface AFailure extends DefaultAction {
  type:
    | ActionTypes.INIT_FAILURE
    | ActionTypes.PREPARE_TX_FAILURE
    | ActionTypes.SEND_TX_FAILURE
    | ActionTypes.CONFIRM_TX_FAILURE;
  payload: Error | string;
  error: boolean;
}
interface AInitSuccess extends DefaultAction {
  type: ActionTypes.INIT_SUCCESS;
  payload: {
    txs: ITxObject[];
    account: StoreAccount;
    network: Network;
  };
}
interface APrepareSuccess extends DefaultAction {
  type: ActionTypes.PREPARE_TX_SUCCESS;
  payload: {
    txRaw: ITxObject;
  };
}

interface ASendSuccess extends DefaultAction {
  type: ActionTypes.SEND_TX_SUCCESS;
  payload: {
    txHash: ITxHash;
    txResponse: TransactionResponse;
  };
}
interface AConfirmSuccess extends DefaultAction {
  type: ActionTypes.CONFIRM_TX_SUCCESS;
  payload: {
    txReceipt: TransactionReceipt;
    minedAt: number;
  };
}

export type TxMultiAction =
  | AFailure
  | ARequest
  | AInitSuccess
  | APrepareSuccess
  | ASendSuccess
  | AConfirmSuccess;
