import { Reducer, combineReducers } from 'redux';
import BN from 'bn.js';
import { gasPriceToBase, getDecimalFromEtherUnit } from 'libs/units';
import {
  TypeKeys,
  BroadcastState,
  ITransactionStatus,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionFailedAction,
  BroadcastAction,
  FieldsState,
  FieldAction,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapAction,
  ResetTransactionSuccessfulAction,
  MetaState,
  MetaAction,
  SetUnitMetaAction,
  NetworkAction,
  TransactionMetaAction,
  NetworkState,
  RequestStatus,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  SignState,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction,
  SignAction
} from './types';

//#region Broadcast
export const BROADCAST_INITIAL_STATE = {};
const handleQueue = (
  state: BroadcastState,
  { payload }: BroadcastTransactionQueuedAction
): BroadcastState => {
  const { indexingHash, serializedTransaction } = payload;
  const nextTxStatus: ITransactionStatus = {
    broadcastedHash: null,
    broadcastSuccessful: false,
    isBroadcasting: true,
    serializedTransaction
  };
  return { ...state, [indexingHash]: nextTxStatus };
};

const handleSuccess = (
  state: BroadcastState,
  { payload }: BroadcastTransactionSucceededAction
): BroadcastState => {
  const { broadcastedHash, indexingHash } = payload;
  const existingTx = state[indexingHash];
  if (!existingTx) {
    throw Error(`Broadcasted transaction not found: ${indexingHash}`);
  }
  const nextTx: ITransactionStatus = {
    ...existingTx,
    broadcastedHash,
    isBroadcasting: false,
    broadcastSuccessful: true
  };
  return { ...state, [indexingHash]: nextTx };
};

const handleFailure = (
  state: BroadcastState,
  { payload }: BroadcastTransactionFailedAction
): BroadcastState => {
  const { indexingHash } = payload;
  const existingTx = state[indexingHash];
  if (!existingTx) {
    throw Error(`Broadcasted transaction not found: ${indexingHash}`);
  }
  const nextTx: ITransactionStatus = {
    ...existingTx,
    isBroadcasting: false,
    broadcastSuccessful: false
  };
  return { ...state, [indexingHash]: nextTx };
};

export const broadcast = (
  state: BroadcastState = BROADCAST_INITIAL_STATE,
  action: BroadcastAction
) => {
  switch (action.type) {
    case TypeKeys.BROADCAST_TRANSACTION_QUEUED:
      return handleQueue(state, action);
    case TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED:
      return handleSuccess(state, action);
    case TypeKeys.BROADCAST_TRASACTION_FAILED:
      return handleFailure(state, action);
    default:
      return state;
  }
};
//#endregion Broadcast

//#region Fields
export const FIELDS_INITIAL_STATE: FieldsState = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  gasLimit: { raw: '21000', value: new BN(21000) },
  gasPrice: { raw: '20', value: gasPriceToBase(20) }
};

const updateField = (key: keyof FieldsState): Reducer<FieldsState> => (
  state: FieldsState,
  action: FieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

const tokenToEther = (
  state: FieldsState,
  { payload: { decimal: _, ...rest } }: SwapTokenToEtherAction
): FieldsState => ({
  ...state,
  ...rest,
  data: FIELDS_INITIAL_STATE.data
});

const etherToToken = (
  state: FieldsState,
  { payload: { decimal: _, tokenTo: __, tokenValue: ___, ...rest } }: SwapEtherToTokenAction
): FieldsState => ({
  ...state,
  ...rest,
  value: FIELDS_INITIAL_STATE.value
});

const tokenToToken = (
  state: FieldsState,
  { payload: { decimal: _, tokenValue: __, ...rest } }: SwapTokenToTokenAction
): FieldsState => ({ ...state, ...rest });

const reset = (
  state: FieldsState,
  { payload: { isContractInteraction } }: ResetTransactionSuccessfulAction
): FieldsState => ({
  ...FIELDS_INITIAL_STATE,
  ...(isContractInteraction ? { to: state.to } : {})
});

export const fields = (
  state: FieldsState = FIELDS_INITIAL_STATE,
  action: FieldAction | SwapAction | ResetTransactionSuccessfulAction
) => {
  switch (action.type) {
    case TypeKeys.TO_FIELD_SET:
      return updateField('to')(state, action);
    case TypeKeys.VALUE_FIELD_SET:
      return updateField('value')(state, action);
    case TypeKeys.DATA_FIELD_SET:
      return updateField('data')(state, action);
    case TypeKeys.GAS_LIMIT_FIELD_SET:
      return updateField('gasLimit')(state, action);
    case TypeKeys.NONCE_FIELD_SET:
      return updateField('nonce')(state, action);
    case TypeKeys.GAS_PRICE_FIELD_SET:
      return updateField('gasPrice')(state, action);
    case TypeKeys.TOKEN_TO_ETHER_SWAP:
      return tokenToEther(state, action);
    case TypeKeys.ETHER_TO_TOKEN_SWAP:
      return etherToToken(state, action);
    case TypeKeys.TOKEN_TO_TOKEN_SWAP:
      return tokenToToken(state, action);

    case TypeKeys.RESET_SUCCESSFUL:
      return reset(state, action);
    default:
      return state;
  }
};
//#endregion Fields

//#region Meta
export const META_INITIAL_STATE: MetaState = {
  unit: '',
  previousUnit: '',
  decimal: getDecimalFromEtherUnit('ether'),
  tokenValue: { raw: '', value: null },
  tokenTo: { raw: '', value: null },
  from: null,
  isContractInteraction: false
};

//TODO: generic-ize updateField to reuse
const updateMetaField = (key: keyof MetaState): Reducer<MetaState> => (
  state: MetaState,
  action: TransactionMetaAction
) => {
  if (typeof action.payload === 'object') {
    // we do this to update just 'raw' or 'value' param of tokenValue
    return {
      ...state,
      [key]: { ...(state[key] as object), ...action.payload }
    };
  } else {
    return {
      ...state,
      [key]: action.payload
    };
  }
};

const tokenToEtherMeta = (state: MetaState, { payload }: SwapTokenToEtherAction): MetaState => {
  const { tokenValue, tokenTo } = META_INITIAL_STATE;
  return { ...state, tokenTo, tokenValue, decimal: payload.decimal };
};

const etherToTokenMeta = (
  state: MetaState,
  { payload: { data: _, to: __, ...rest } }: SwapEtherToTokenAction
): MetaState => ({ ...state, ...rest });

const tokenToTokenMeta = (
  state: MetaState,
  { payload: { data: _, to: __, ...rest } }: SwapTokenToTokenAction
): MetaState => ({ ...state, ...rest });

const resetMeta = (state: MetaState): MetaState => ({
  ...META_INITIAL_STATE,
  isContractInteraction: state.isContractInteraction,
  unit: state.unit
});

const unitMeta = (state: MetaState, { payload }: SetUnitMetaAction): MetaState => ({
  ...state,
  previousUnit: state.unit,
  unit: payload
});

export const meta = (
  state: MetaState = META_INITIAL_STATE,
  action: MetaAction | SwapAction | ResetTransactionSuccessfulAction | NetworkAction
): MetaState => {
  switch (action.type) {
    case TypeKeys.UNIT_META_SET:
      return unitMeta(state, action);
    case TypeKeys.TOKEN_VALUE_META_SET:
      return updateMetaField('tokenValue')(state, action);
    case TypeKeys.TOKEN_TO_META_SET:
      return updateMetaField('tokenTo')(state, action);
    case TypeKeys.GET_FROM_SUCCEEDED:
      return updateMetaField('from')(state, action);
    case TypeKeys.TOKEN_TO_ETHER_SWAP:
      return tokenToEtherMeta(state, action);
    case TypeKeys.ETHER_TO_TOKEN_SWAP:
      return etherToTokenMeta(state, action);
    case TypeKeys.TOKEN_TO_TOKEN_SWAP:
      return tokenToTokenMeta(state, action);

    case TypeKeys.IS_VIEW_AND_SEND: {
      const nextState: MetaState = { ...state, isContractInteraction: false };
      return nextState;
    }
    case TypeKeys.IS_CONTRACT_INTERACTION: {
      const nextState: MetaState = { ...state, isContractInteraction: true };
      return nextState;
    }
    case TypeKeys.RESET_SUCCESSFUL:
      return resetMeta(state);
    default:
      return state;
  }
};
//#endregion Meta

//#region Network
export const NETWORK_INITIAL_STATE: NetworkState = {
  gasEstimationStatus: null,
  getFromStatus: null,
  getNonceStatus: null,
  gasPriceStatus: null
};

const getPostFix = (str: string): keyof typeof RequestStatus => {
  const arr = str.split('_');
  return arr[arr.length - 1] as any;
};

const getNextState = (field: keyof NetworkState) => (
  state: NetworkState,
  action: NetworkAction
): NetworkState => ({
  ...state,
  [field]: RequestStatus[getPostFix(action.type)]
});

const setGasPriceStatus = (state: NetworkState, gasPriceStatus: RequestStatus) => ({
  ...state,
  gasPriceStatus
});

const resetNetwork = () => NETWORK_INITIAL_STATE;

export const network = (
  state: NetworkState = NETWORK_INITIAL_STATE,
  action:
    | NetworkAction
    | ResetTransactionSuccessfulAction
    | InputGasPriceAction
    | InputGasPriceIntentAction
) => {
  switch (action.type) {
    case TypeKeys.ESTIMATE_GAS_REQUESTED:
      return getNextState('gasEstimationStatus')(state, action);
    case TypeKeys.ESTIMATE_GAS_FAILED:
      return getNextState('gasEstimationStatus')(state, action);
    case TypeKeys.ESTIMATE_GAS_TIMEDOUT:
      return getNextState('gasEstimationStatus')(state, action);
    case TypeKeys.ESTIMATE_GAS_SUCCEEDED:
      return getNextState('gasEstimationStatus')(state, action);
    case TypeKeys.GET_FROM_REQUESTED:
      return getNextState('getFromStatus')(state, action);
    case TypeKeys.GET_FROM_SUCCEEDED:
      return getNextState('getFromStatus')(state, action);
    case TypeKeys.GET_FROM_FAILED:
      return getNextState('getFromStatus')(state, action);
    case TypeKeys.GET_NONCE_REQUESTED:
      return getNextState('getNonceStatus')(state, action);
    case TypeKeys.GET_NONCE_SUCCEEDED:
      return getNextState('getNonceStatus')(state, action);
    case TypeKeys.GET_NONCE_FAILED:
      return getNextState('getNonceStatus')(state, action);

    // Not exactly "network" requests, but we want to show pending while
    // gas price is subject to change
    case TypeKeys.GAS_PRICE_INPUT_INTENT:
      return setGasPriceStatus(state, RequestStatus.REQUESTED);
    case TypeKeys.GAS_PRICE_INPUT:
      return setGasPriceStatus(state, RequestStatus.SUCCEEDED);

    case TypeKeys.RESET_SUCCESSFUL:
      return resetNetwork();
    default:
      return state;
  }
};
//#endregion Network

//#region Sign
export const SIGN_INITIAL_STATE: SignState = {
  local: { signedTransaction: null },
  web3: { transaction: null },
  indexingHash: null,
  pending: false
};

const signTransactionRequested = (): SignState => ({
  ...SIGN_INITIAL_STATE,
  pending: true
});

const signLocalTransactionSucceeded = (
  _: SignState,
  { payload }: SignLocalTransactionSucceededAction
): SignState => ({
  indexingHash: payload.indexingHash,
  pending: false,

  local: { signedTransaction: payload.signedTransaction },
  web3: { transaction: null }
});

const signWeb3TranscationSucceeded = (
  _: SignState,
  { payload }: SignWeb3TransactionSucceededAction
): SignState => ({
  indexingHash: payload.indexingHash,
  pending: false,

  local: { signedTransaction: null },
  web3: { transaction: payload.transaction }
});

const signTransactionFailed = () => SIGN_INITIAL_STATE;

const resetSign = () => SIGN_INITIAL_STATE;

export const sign = (
  state: SignState = SIGN_INITIAL_STATE,
  action: SignAction | ResetTransactionSuccessfulAction
) => {
  switch (action.type) {
    case TypeKeys.SIGN_TRANSACTION_REQUESTED:
      return signTransactionRequested();
    case TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED:
      return signLocalTransactionSucceeded(state, action);
    case TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED:
      return signWeb3TranscationSucceeded(state, action);
    case TypeKeys.SIGN_TRANSACTION_FAILED:
      return signTransactionFailed();
    case TypeKeys.RESET_SUCCESSFUL:
      return resetSign();
    default:
      return state;
  }
};
//#endregion Sign

export const transaction = combineReducers({
  fields,
  meta,
  network,
  sign,
  broadcast
});

export interface State {
  network: NetworkState;
  fields: FieldsState;
  meta: MetaState;
  sign: SignState;
  broadcast: BroadcastState;
}

export const INITIAL_STATE: State = transaction({}, { type: undefined }) as State;

export default transaction;
