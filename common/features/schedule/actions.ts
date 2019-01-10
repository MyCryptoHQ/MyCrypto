import * as types from './types';

//#region Fields
export type TSetTimeBountyField = typeof setTimeBountyField;
export const setTimeBountyField = (
  payload: types.SetTimeBountyFieldAction['payload']
): types.SetTimeBountyFieldAction => ({
  type: types.ScheduleActions.TIME_BOUNTY_FIELD_SET,
  payload
});

export type TSetWindowSizeField = typeof setWindowSizeField;
export const setWindowSizeField = (
  payload: types.SetWindowSizeFieldAction['payload']
): types.SetWindowSizeFieldAction => ({
  type: types.ScheduleActions.WINDOW_SIZE_FIELD_SET,
  payload
});

export type TSetWindowStartField = typeof setWindowStartField;
export const setWindowStartField = (
  payload: types.SetWindowStartFieldAction['payload']
): types.SetWindowStartFieldAction => ({
  type: types.ScheduleActions.WINDOW_START_FIELD_SET,
  payload
});

export type TSetScheduleTimestampField = typeof setScheduleTimestampField;
export const setScheduleTimestampField = (
  payload: types.SetScheduleTimestampFieldAction['payload']
): types.SetScheduleTimestampFieldAction => ({
  type: types.ScheduleActions.TIMESTAMP_FIELD_SET,
  payload
});

export type TSetScheduleType = typeof setScheduleType;
export const setScheduleType = (
  payload: types.SetScheduleTypeAction['payload']
): types.SetScheduleTypeAction => ({
  type: types.ScheduleActions.TYPE_SET,
  payload
});

export type TSetSchedulingToggle = typeof setSchedulingToggle;
export const setSchedulingToggle = (
  payload: types.SetSchedulingToggleAction['payload']
): types.SetSchedulingToggleAction => ({
  type: types.ScheduleActions.TOGGLE_SET,
  payload
});

export type TSetScheduleTimezone = typeof setScheduleTimezone;
export const setScheduleTimezone = (
  payload: types.SetScheduleTimezoneAction['payload']
): types.SetScheduleTimezoneAction => ({
  type: types.ScheduleActions.TIMEZONE_SET,
  payload
});

export type TSetScheduleGasPriceField = typeof setScheduleGasPriceField;
export const setScheduleGasPriceField = (
  payload: types.SetScheduleGasPriceFieldAction['payload']
) => ({
  type: types.ScheduleActions.GAS_PRICE_FIELD_SET,
  payload
});

export type TSetScheduleGasLimitField = typeof setScheduleGasLimitField;
export const setScheduleGasLimitField = (
  payload: types.SetScheduleGasLimitFieldAction['payload']
) => ({
  type: types.ScheduleActions.GAS_LIMIT_FIELD_SET,
  payload
});

export type TSetScheduleDepositField = typeof setScheduleDepositField;
export const setScheduleDepositField = (
  payload: types.SetScheduleDepositFieldAction['payload']
) => ({
  type: types.ScheduleActions.DEPOSIT_FIELD_SET,
  payload
});

export type TSetScheduleParamsValidity = typeof setScheduleParamsValidity;
export const setScheduleParamsValidity = (
  payload: types.SetScheduleParamsValidityAction['payload']
) => ({
  type: types.ScheduleActions.PARAMS_VALIDITY_SET,
  payload
});
//#endregion Fields

//#region Schedule Timestamp
export type TSetCurrentScheduleTimestamp = typeof setCurrentScheduleTimestamp;
export const setCurrentScheduleTimestamp = (
  payload: types.SetCurrentScheduleTimestampAction['payload']
): types.SetCurrentScheduleTimestampAction => ({
  type: types.ScheduleActions.CURRENT_SCHEDULE_TIMESTAMP_SET,
  payload
});

export type TSetCurrentScheduleTimezone = typeof setCurrentScheduleTimezone;
export const setCurrentScheduleTimezone = (
  payload: types.SetCurrentScheduleTimezoneAction['payload']
): types.SetCurrentScheduleTimezoneAction => ({
  type: types.ScheduleActions.CURRENT_SCHEDULE_TIMEZONE_SET,
  payload
});
//#endregion Schedule Timestamp

//#region Schedule Type
export type TSetCurrentScheduleType = typeof setCurrentScheduleType;
export const setCurrentScheduleType = (
  payload: types.SetCurrentScheduleTypeAction['payload']
): types.SetCurrentScheduleTypeAction => ({
  type: types.ScheduleActions.CURRENT_SCHEDULE_TYPE,
  payload
});
//#endregion Schedule Type

//#region Time Bounty
export type TSetCurrentTimeBounty = typeof setCurrentTimeBounty;
export const setCurrentTimeBounty = (
  payload: types.SetCurrentTimeBountyAction['payload']
): types.SetCurrentTimeBountyAction => ({
  type: types.ScheduleActions.CURRENT_TIME_BOUNTY_SET,
  payload
});
//#endregion Time Bounty

//#region Window Size
export type TSetCurrentWindowSize = typeof setCurrentWindowSize;
export const setCurrentWindowSize = (
  payload: types.SetCurrentWindowSizeAction['payload']
): types.SetCurrentWindowSizeAction => ({
  type: types.ScheduleActions.CURRENT_WINDOW_SIZE_SET,
  payload
});
//#endregion Window Size

//#region Window Size
export type TSetCurrentWindowStart = typeof setCurrentWindowStart;
export const setCurrentWindowStart = (
  payload: types.SetCurrentWindowStartAction['payload']
): types.SetCurrentWindowStartAction => ({
  type: types.ScheduleActions.CURRENT_WINDOW_START_SET,
  payload
});
//#endregion Window Size

//#region Estimate Scheduling Gas
export type TEstimateSchedulingGasRequested = typeof estimateSchedulingGasRequested;
export const estimateSchedulingGasRequested = (
  payload: types.EstimateSchedulingGasRequestedAction['payload']
): types.EstimateSchedulingGasRequestedAction => ({
  type: types.ScheduleActions.ESTIMATE_SCHEDULING_GAS_REQUESTED,
  payload
});

export type TEstimateSchedulingGasSucceeded = typeof estimateSchedulingGasSucceeded;
export const estimateSchedulingGasSucceeded = (): types.EstimateSchedulingGasSucceededAction => ({
  type: types.ScheduleActions.ESTIMATE_SCHEDULING_GAS_SUCCEEDED
});

export type TEstimateSchedulingGasFailed = typeof estimateSchedulingGasFailed;
export const estimateSchedulingGasFailed = (): types.EstimateSchedulingGasFailedAction => ({
  type: types.ScheduleActions.ESTIMATE_SCHEDULING_GAS_FAILED
});

export type TEstimateSchedulingGasTimedout = typeof estimateSchedulingGasTimedout;
export const estimateSchedulingGasTimedout = (): types.EstimateSchedulingGasTimeoutAction => ({
  type: types.ScheduleActions.ESTIMATE_SCHEDULING_GAS_TIMEDOUT
});
//#endregion Estimate Scheduling Gas

//#region Scheduled Transaction Hash
export type TSetScheduledTransactionHash = typeof setScheduledTransactionHash;
export const setScheduledTransactionHash = (
  payload: types.SetScheduledTransactionHashAction['payload']
): types.SetScheduledTransactionHashAction => ({
  type: types.ScheduleActions.SCHEDULED_TRANSACTION_HASH_SET,
  payload
});
//#endregion

//#region Scheduled Transaction Address
export type TSetScheduledTransactionAddress = typeof setScheduledTransactionAddress;
export const setScheduledTransactionAddress = (
  payload: types.SetScheduledTransactionAddressAction['payload']
): types.SetScheduledTransactionAddressAction => ({
  type: types.ScheduleActions.SCHEDULED_TRANSACTION_ADDRESS_SET,
  payload
});
//#endregion

//#region Scheduled Tokens Approve Transaction
export type TSetScheduledTokensApproveTransaction = typeof setScheduledTokensApproveTransaction;
export const setScheduledTokensApproveTransaction = (
  payload: types.SetScheduledTokensApproveTransactionAction['payload']
): types.SetScheduledTokensApproveTransactionAction => ({
  type: types.ScheduleActions.SCHEDULED_TOKENS_APPROVE_TRANSACTION_SET,
  payload
});
//#endregion

//#region Scheduled Transaction Hash
export type TSetScheduledTokenTransferSymbol = typeof setScheduledTokenTransferSymbol;
export const setScheduledTokenTransferSymbol = (
  payload: types.SetScheduledTokenTransferSymbolAction['payload']
): types.SetScheduledTokenTransferSymbolAction => ({
  type: types.ScheduleActions.SCHEDULED_TOKEN_TRANSFER_SYMBOL_SET,
  payload
});
//#endregion

//#region Scheduled Transaction Hash
export type TSetSendingTokenApproveTransaction = typeof setSendingTokenApproveTransaction;
export const setSendingTokenApproveTransaction = (
  payload: types.SetSendingTokenApproveTransactionAction['payload']
): types.SetSendingTokenApproveTransactionAction => ({
  type: types.ScheduleActions.SENDING_TOKEN_APPROVE_TRANSACTION_SET,
  payload
});
//#endregion
