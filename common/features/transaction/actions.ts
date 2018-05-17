import {
  TypeKeys,
  BroadcastLocalTransactionRequestedAction,
  BroadcastWeb3TransactionRequestedAction,
  BroadcastTransactionFailedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionQueuedAction,
  SetCurrentToAction,
  SetCurrentValueAction,
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  InputDataAction,
  InputNonceAction,
  ResetTransactionRequestedAction,
  ResetTransactionSuccessfulAction,
  SetGasPriceFieldAction,
  SetUnitMetaAction,
  SetTokenValueMetaAction,
  SetTokenToMetaAction,
  SetAsContractInteractionAction,
  SetAsViewAndSendAction,
  EstimateGasFailedAction,
  EstimateGasRequestedAction,
  EstimateGasTimeoutAction,
  EstimateGasSucceededAction,
  GetFromRequestedAction,
  GetFromSucceededAction,
  GetFromFailedAction,
  GetNonceRequestedAction,
  GetNonceSucceededAction,
  GetNonceFailedAction,
  SendEverythingFailedAction,
  SendEverythingRequestedAction,
  SendEverythingSucceededAction,
  SignTransactionFailedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction,
  SignTransactionRequestedAction,
  SwapEtherToTokenAction,
  SwapTokenToEtherAction,
  SwapTokenToTokenAction
} from './types';

//#region Broadcast
export type TBroadcastLocalTransactionRequested = typeof broadcastLocalTransactionRequested;
export const broadcastLocalTransactionRequested = (): BroadcastLocalTransactionRequestedAction => ({
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED
});

export type TBroadcastWeb3TransactionRequested = typeof broadcastWeb3TransactionRequested;
export const broadcastWeb3TransactionRequested = (): BroadcastWeb3TransactionRequestedAction => ({
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED
});

export type TBroadcastTransactionSucceeded = typeof broadcastTransactionSucceeded;
export const broadcastTransactionSucceeded = (
  payload: BroadcastTransactionSucceededAction['payload']
): BroadcastTransactionSucceededAction => ({
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED,
  payload
});

export type TBroadcastTransactionFailed = typeof broadcastTransactionFailed;
export const broadcastTransactionFailed = (
  payload: BroadcastTransactionFailedAction['payload']
): BroadcastTransactionFailedAction => ({
  type: TypeKeys.BROADCAST_TRASACTION_FAILED,
  payload
});

export type TBroadcastTransactionQueued = typeof broadcastTransactionQueued;
export const broadcastTransactionQueued = (
  payload: BroadcastTransactionQueuedAction['payload']
): BroadcastTransactionQueuedAction => ({
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED,
  payload
});
//#endregion Broadcast

//#region Current
export type TSetCurrentValue = typeof setCurrentValue;
export const setCurrentValue = (
  payload: SetCurrentValueAction['payload']
): SetCurrentValueAction => ({
  type: TypeKeys.CURRENT_VALUE_SET,
  payload
});

export type TSetCurrentTo = typeof setCurrentTo;
export const setCurrentTo = (payload: SetCurrentToAction['payload']): SetCurrentToAction => ({
  type: TypeKeys.CURRENT_TO_SET,
  payload
});
//#endregion Current

//#region Fields
export type TInputGasLimit = typeof inputGasLimit;
export const inputGasLimit = (payload: InputGasLimitAction['payload']) => ({
  type: TypeKeys.GAS_LIMIT_INPUT,
  payload
});

export type TInputGasPrice = typeof inputGasPrice;
export const inputGasPrice = (payload: InputGasPriceAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT,
  payload
});

export type TInputGasPriceIntent = typeof inputGasPrice;
export const inputGasPriceIntent = (payload: InputGasPriceIntentAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT_INTENT,
  payload
});

export type TInputNonce = typeof inputNonce;
export const inputNonce = (payload: InputNonceAction['payload']) => ({
  type: TypeKeys.NONCE_INPUT,
  payload
});

export type TInputData = typeof inputData;
export const inputData = (payload: InputDataAction['payload']) => ({
  type: TypeKeys.DATA_FIELD_INPUT,
  payload
});

export type TSetGasLimitField = typeof setGasLimitField;
export const setGasLimitField = (
  payload: SetGasLimitFieldAction['payload']
): SetGasLimitFieldAction => ({
  type: TypeKeys.GAS_LIMIT_FIELD_SET,
  payload
});

export type TSetDataField = typeof setDataField;
export const setDataField = (payload: SetDataFieldAction['payload']): SetDataFieldAction => ({
  type: TypeKeys.DATA_FIELD_SET,
  payload
});

export type TSetToField = typeof setToField;
export const setToField = (payload: SetToFieldAction['payload']): SetToFieldAction => ({
  type: TypeKeys.TO_FIELD_SET,
  payload
});

export type TSetNonceField = typeof setNonceField;
export const setNonceField = (payload: SetNonceFieldAction['payload']): SetNonceFieldAction => ({
  type: TypeKeys.NONCE_FIELD_SET,
  payload
});

export type TSetValueField = typeof setValueField;
export const setValueField = (payload: SetValueFieldAction['payload']): SetValueFieldAction => ({
  type: TypeKeys.VALUE_FIELD_SET,
  payload
});

export type TSetGasPriceField = typeof setGasPriceField;
export const setGasPriceField = (
  payload: SetGasPriceFieldAction['payload']
): SetGasPriceFieldAction => ({
  type: TypeKeys.GAS_PRICE_FIELD_SET,
  payload
});

export type TResetTransactionRequested = typeof resetTransactionRequested;
export const resetTransactionRequested = (): ResetTransactionRequestedAction => ({
  type: TypeKeys.RESET_REQUESTED
});

export type TResetTransactionSuccessful = typeof resetTransactionSuccessful;
export const resetTransactionSuccessful = (
  payload: ResetTransactionSuccessfulAction['payload']
): ResetTransactionSuccessfulAction => ({
  type: TypeKeys.RESET_SUCCESSFUL,
  payload
});
//#endregion Fields

//#region Meta
export type TSetTokenTo = typeof setTokenTo;
export const setTokenTo = (payload: SetTokenToMetaAction['payload']): SetTokenToMetaAction => ({
  type: TypeKeys.TOKEN_TO_META_SET,
  payload
});

export type TSetTokenValue = typeof setTokenValue;
export const setTokenValue = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

export type TSetUnitMeta = typeof setUnitMeta;
export const setUnitMeta = (payload: SetUnitMetaAction['payload']): SetUnitMetaAction => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});

export type TSetAsContractInteraction = typeof setAsContractInteraction;
export const setAsContractInteraction = (): SetAsContractInteractionAction => ({
  type: TypeKeys.IS_CONTRACT_INTERACTION
});

export type TSetAsViewAndSend = typeof setAsViewAndSend;
export const setAsViewAndSend = (): SetAsViewAndSendAction => ({ type: TypeKeys.IS_VIEW_AND_SEND });
//#endregion Meta

//#region Network
export type TEstimateGasRequested = typeof estimateGasRequested;
export const estimateGasRequested = (
  payload: EstimateGasRequestedAction['payload']
): EstimateGasRequestedAction => ({
  type: TypeKeys.ESTIMATE_GAS_REQUESTED,
  payload
});

export type TEstimateGasSucceeded = typeof estimateGasSucceeded;
export const estimateGasSucceeded = (): EstimateGasSucceededAction => ({
  type: TypeKeys.ESTIMATE_GAS_SUCCEEDED
});

export type TEstimateGasFailed = typeof estimateGasFailed;
export const estimateGasFailed = (): EstimateGasFailedAction => ({
  type: TypeKeys.ESTIMATE_GAS_FAILED
});

export type TEstimateGasTimedout = typeof estimateGasTimedout;
export const estimateGasTimedout = (): EstimateGasTimeoutAction => ({
  type: TypeKeys.ESTIMATE_GAS_TIMEDOUT
});

export type TGetFromRequested = typeof getFromRequested;
export const getFromRequested = (): GetFromRequestedAction => ({
  type: TypeKeys.GET_FROM_REQUESTED
});

export type TGetFromSucceeded = typeof getFromSucceeded;
export const getFromSucceeded = (
  payload: GetFromSucceededAction['payload']
): GetFromSucceededAction => ({
  type: TypeKeys.GET_FROM_SUCCEEDED,
  payload
});

export type TGetFromFailed = typeof getFromFailed;
export const getFromFailed = (): GetFromFailedAction => ({
  type: TypeKeys.GET_FROM_FAILED
});

export type TGetNonceRequested = typeof getNonceRequested;
export const getNonceRequested = (): GetNonceRequestedAction => ({
  type: TypeKeys.GET_NONCE_REQUESTED
});

export type TGetNonceSucceeded = typeof getNonceSucceeded;
export const getNonceSucceeded = (
  payload: GetNonceSucceededAction['payload']
): GetNonceSucceededAction => ({ type: TypeKeys.GET_NONCE_SUCCEEDED, payload });

export type TGetNonceFailed = typeof getNonceFailed;
export const getNonceFailed = (): GetNonceFailedAction => ({
  type: TypeKeys.GET_NONCE_FAILED
});
//#endregion Network

//#region Send Everything
export type TSendEverythingRequested = typeof sendEverythingRequested;
export const sendEverythingRequested = (): SendEverythingRequestedAction => ({
  type: TypeKeys.SEND_EVERYTHING_REQUESTED
});

export type TSendEverythingFailed = typeof sendEverythingFailed;
export const sendEverythingFailed = (): SendEverythingFailedAction => ({
  type: TypeKeys.SEND_EVERYTHING_FAILED
});

export type TSendEverythingSucceeded = typeof sendEverythingSucceeded;
export const sendEverythingSucceeded = (): SendEverythingSucceededAction => ({
  type: TypeKeys.SEND_EVERYTHING_SUCCEEDED
});
//#endregion Send Everything

//#region Sign
export type TSignTransactionFailed = typeof signTransactionFailed;
export const signTransactionFailed = (): SignTransactionFailedAction => ({
  type: TypeKeys.SIGN_TRANSACTION_FAILED
});

export type TSignTransactionRequested = typeof signTransactionRequested;
export const signTransactionRequested = (payload: SignTransactionRequestedAction['payload']) => ({
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED,
  payload
});

export type TSignLocalTransactionSucceeded = typeof signLocalTransactionSucceeded;
export const signLocalTransactionSucceeded = (
  payload: SignLocalTransactionSucceededAction['payload']
): SignLocalTransactionSucceededAction => ({
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
  payload
});

export type TSignWeb3TransactionSucceeded = typeof signWeb3TransactionSucceeded;
export const signWeb3TransactionSucceeded = (
  payload: SignWeb3TransactionSucceededAction['payload']
): SignWeb3TransactionSucceededAction => ({
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED,
  payload
});
//#endregion Sign

//#region Swap
export type TSwapTokenToEther = typeof swapTokenToEther;
export const swapTokenToEther = (
  payload: SwapTokenToEtherAction['payload']
): SwapTokenToEtherAction => ({
  type: TypeKeys.TOKEN_TO_ETHER_SWAP,
  payload
});

export type TSwapEtherToToken = typeof swapEtherToToken;
export const swapEtherToToken = (
  payload: SwapEtherToTokenAction['payload']
): SwapEtherToTokenAction => ({
  payload,
  type: TypeKeys.ETHER_TO_TOKEN_SWAP
});

export const swapTokenToToken = (
  payload: SwapTokenToTokenAction['payload']
): SwapTokenToTokenAction => ({
  payload,
  type: TypeKeys.TOKEN_TO_TOKEN_SWAP
});
//#endregion Swap
