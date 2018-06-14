import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';
import EthTx from 'ethereumjs-tx';

import { AppState } from 'features/reducers';
import { Nonce, Wei } from 'libs/units';
import { gasPriceValidator, gasLimitValidator, timeBountyValidator } from 'libs/validators';
import { makeTransaction } from 'libs/transaction';
import {
  EAC_SCHEDULING_CONFIG,
  getScheduleData,
  calcEACEndowment,
  getSchedulerAddress,
  EAC_ADDRESSES,
  getValidateRequestParamsData
} from 'libs/scheduling';
import { getLatestBlock } from 'features/config';
import { getWalletInst } from 'features/wallet';
import {
  getCurrentTo,
  getCurrentValue,
  getData,
  getNonce,
  getGasPrice,
  IGetTransaction,
  getTransaction
} from 'features/transaction';
import {
  dateTimeToTimezone,
  minFromNow,
  windowSizeBlockToMin,
  calculateWindowStart,
  isWindowStartValid,
  isScheduleTimestampValid,
  ICurrentScheduleTimestamp
} from './helpers';

//#region Fields
export const getScheduleState = (state: AppState) => state.schedule;
export const getTimeBounty = (state: AppState) => getScheduleState(state).timeBounty;
export const getWindowSize = (state: AppState) => getScheduleState(state).windowSize;
export const getWindowStart = (state: AppState) => getScheduleState(state).windowStart;
export const getScheduleTimestamp = (state: AppState) => getScheduleState(state).scheduleTimestamp;
export const getScheduleType = (state: AppState) => getScheduleState(state).scheduleType;
export const getScheduleTimezone = (state: AppState) => getScheduleState(state).scheduleTimezone;
export const getSchedulingToggle = (state: AppState) => getScheduleState(state).schedulingToggle;
export const getScheduleGasLimit = (state: AppState) => getScheduleState(state).scheduleGasLimit;
export const getScheduleGasPrice = (state: AppState) => getScheduleState(state).scheduleGasPrice;
export const getScheduleDeposit = (state: AppState) => getScheduleState(state).scheduleDeposit;
export const getScheduleParamsValidity = (state: AppState) =>
  getScheduleState(state).scheduleParamsValidity;

export const isValidScheduleGasPrice = (state: AppState): boolean =>
  gasPriceValidator(getScheduleGasPrice(state).raw);

export const isValidScheduleGasLimit = (state: AppState): boolean =>
  gasLimitValidator(getScheduleGasLimit(state).raw);

export const isValidScheduleDeposit = (state: AppState): boolean => {
  const depositValue = getScheduleDeposit(state).value;

  if (!depositValue) {
    return true;
  }

  return depositValue.gte(new BN('0')) && depositValue.bitLength() <= 256;
};

export const isSchedulingEnabled = (state: AppState): boolean => {
  const schedulingToggle = getSchedulingToggle(state);

  return schedulingToggle && schedulingToggle.value;
};
//#endregion Fields

//#region Transaction
export const getSchedulingTransaction = (state: AppState): IGetTransaction => {
  const { isFullTransaction } = getTransaction(state);

  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const nonce = getNonce(state);
  const gasPrice = getGasPrice(state);
  const timeBounty = getTimeBounty(state);
  const scheduleGasPrice = getScheduleGasPrice(state);
  const scheduleGasLimit = getScheduleGasLimit(state);
  const scheduleType = getScheduleType(state);

  const endowment = calcEACEndowment(
    scheduleGasLimit.value,
    currentValue.value,
    scheduleGasPrice.value,
    timeBounty.value
  );

  let transactionData = null;

  const transactionFullAndValid = isFullTransaction && isSchedulingTransactionValid(state);

  if (transactionFullAndValid) {
    const deposit = getScheduleDeposit(state);
    const scheduleTimestamp = getScheduleTimestamp(state);
    const windowSize = getWindowSize(state);
    const callData = getData(state);
    const scheduleTimezone = getScheduleTimezone(state);
    const windowStart = getWindowStart(state);

    transactionData = getScheduleData(
      currentTo.raw,
      callData.raw,
      scheduleGasLimit.value,
      currentValue.value,
      windowSizeBlockToMin(windowSize.value, scheduleType.value),
      calculateWindowStart(
        scheduleType.value,
        scheduleTimestamp,
        scheduleTimezone.value,
        windowStart.value
      ),
      scheduleGasPrice.value,
      timeBounty.value,
      deposit.value
    );
  }

  const transactionOptions = {
    to: getSchedulerAddress(scheduleType.value),
    data: transactionData,
    gasLimit: EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT,
    gasPrice: gasPrice.value,
    nonce: Nonce('0'),
    value: endowment
  };

  if (nonce) {
    transactionOptions.nonce = Nonce(nonce.raw);
  }

  const schedulingTransaction: EthTx = makeTransaction(transactionOptions);

  return {
    transaction: schedulingTransaction,
    isFullTransaction: transactionFullAndValid
  };
};

const isSchedulingTransactionValid = (state: AppState): boolean => {
  const schedulingState = getScheduleState(state);
  const windowSizeValid = isWindowSizeValid(state);
  const windowStartValid = isWindowStartValid(schedulingState, getLatestBlock(state));
  const scheduleTimestampValid = isScheduleTimestampValid(schedulingState);
  const scheduleGasPriceValid = isValidScheduleGasPrice(state);
  const scheduleGasLimitValid = isValidScheduleGasLimit(state);
  const depositValid = isValidScheduleDeposit(state);
  const timeBountyValid = isValidCurrentTimeBounty(state);

  // return true if all fields are valid
  return (
    // either windowStart or scheduleTimestamp is used for scheduling
    (windowStartValid || scheduleTimestampValid) &&
    windowSizeValid &&
    scheduleGasPriceValid &&
    scheduleGasLimitValid &&
    depositValid &&
    timeBountyValid
  );
};

export interface IGetValidateScheduleParamsCallPayload {
  to: string;
  data: string;
}

export const getValidateScheduleParamsCallPayload = (
  state: AppState
): IGetValidateScheduleParamsCallPayload | undefined => {
  const wallet = getWalletInst(state);
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const timeBounty = getTimeBounty(state);
  const scheduleGasPrice = getScheduleGasPrice(state);
  const scheduleGasLimit = getScheduleGasLimit(state);
  const scheduleType = getScheduleType(state);
  const deposit = getScheduleDeposit(state);
  const scheduleTimestamp = getScheduleTimestamp(state);
  const windowSize = getWindowSize(state);
  const scheduleTimezone = getScheduleTimezone(state);
  const windowStart = getWindowStart(state);

  /*
     * Checks if any of these values are null or invalid
     * due to an user input.
     */
  if (
    !currentValue.value ||
    !currentTo.value ||
    !scheduleGasPrice.value ||
    !wallet ||
    !windowSize.value ||
    // we need either windowStart or scheduleTimestamp for scheduling
    !(windowStart.value || scheduleTimestamp.value)
  ) {
    return;
  }

  const callGasLimit = scheduleGasLimit.value || EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK;

  const endowment = calcEACEndowment(
    callGasLimit,
    currentValue.value,
    scheduleGasPrice.value,
    timeBounty.value
  );

  const fromAddress = wallet.getAddressString();

  const data = getValidateRequestParamsData(
    bufferToHex(currentTo.value),
    callGasLimit,
    currentValue.value,
    windowSizeBlockToMin(windowSize.value, scheduleType.value),
    calculateWindowStart(
      scheduleType.value,
      scheduleTimestamp,
      scheduleTimezone.value,
      windowStart.value
    ),
    scheduleGasPrice.value,
    timeBounty.value,
    deposit.value || Wei('0'),
    scheduleType.value === 'time',
    endowment,
    fromAddress
  );

  return {
    to: EAC_ADDRESSES.KOVAN.requestFactory,
    data
  };
};
//#endregion Transaction

//#region Current

//#region Schedule Timestamp
export const isValidCurrentScheduleTimestamp = (state: AppState) => {
  const currentScheduleTimestamp = getScheduleTimestamp(state);
  const currentScheduleTimezone = getScheduleTimezone(state);

  const currentScheduleDatetime = dateTimeToTimezone(
    currentScheduleTimestamp,
    currentScheduleTimezone.value
  );

  return (
    currentScheduleDatetime >= minFromNow(EAC_SCHEDULING_CONFIG.ALLOW_SCHEDULING_MIN_AFTER_NOW)
  );
};

export const getCurrentScheduleTimestamp = (state: AppState): ICurrentScheduleTimestamp =>
  getScheduleTimestamp(state);
//#endregion Schedule Timestamp

//#region Schedule Timezone
export interface ICurrentScheduleTimezone {
  raw: string;
  value: string;
}

export const getCurrentScheduleTimezone = (state: AppState): ICurrentScheduleTimezone =>
  getScheduleTimezone(state);
//#endregion Schedule Timezone

//#region Schedule Type
export interface ICurrentScheduleType {
  raw: string;
  value: string | null;
}

export const getCurrentScheduleType = (state: AppState): ICurrentScheduleType =>
  getScheduleType(state);
//#endregion Schedule Type

//#region Scheduling Toggle
export interface ICurrentSchedulingToggle {
  value: boolean;
}

export const getCurrentSchedulingToggle = (state: AppState): ICurrentSchedulingToggle =>
  getSchedulingToggle(state);
//#endregion Scheduling Toggle

//#region Time Bounty
export interface ICurrentTimeBounty {
  raw: string;
  value: Wei | null;
}

export const isValidCurrentTimeBounty = (state: AppState) => {
  const currentTimeBounty = getTimeBounty(state);

  return timeBountyValidator(currentTimeBounty.value);
};

export const getCurrentTimeBounty = (state: AppState): ICurrentTimeBounty => getTimeBounty(state);
//#endregion Time Bounty

//#region Window Size
export interface ICurrentWindowSize {
  raw: string;
  value: BN | null;
}

export const isValidCurrentWindowSize = (state: AppState) => {
  const currentWindowSize = getWindowSize(state);

  return (
    currentWindowSize &&
    currentWindowSize.value &&
    currentWindowSize.value.gt(new BN(0)) &&
    currentWindowSize.value.bitLength() <= 256
  );
};

export const getCurrentWindowSize = (state: AppState): ICurrentWindowSize => getWindowSize(state);

export const isWindowSizeValid = (state: AppState): boolean => {
  const windowSize = getWindowSize(state);

  return Boolean(windowSize && windowSize.value && windowSize.value.bitLength() <= 256);
};
//#endregion Window Size

//#region Window Start
export interface ICurrentWindowStart {
  raw: string;
  value: number | null;
}

export const isValidCurrentWindowStart = (state: AppState) => {
  const currentWindowStart = getWindowStart(state);

  if (!currentWindowStart.value) {
    return false;
  }

  return currentWindowStart.value > parseInt(getLatestBlock(state), 10);
};

export const getCurrentWindowStart = (state: AppState): ICurrentWindowStart =>
  getWindowStart(state);
//#endregion Window Start

//#endregion Current
