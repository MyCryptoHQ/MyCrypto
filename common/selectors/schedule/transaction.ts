import { AppState } from 'reducers';
import {
  getCurrentTo,
  getCurrentValue,
  getData,
  getNonce,
  getGasPrice,
  IGetTransaction,
  getTransaction
} from 'selectors/transaction';
import {
  getScheduleType,
  getWindowStart,
  getTimeBounty,
  getWindowSize,
  getScheduleGasPrice,
  getScheduleGasLimit,
  getScheduleDeposit,
  getScheduleTimestamp,
  getScheduleTimezone,
  isValidCurrentTimeBounty,
  isWindowSizeValid,
  isValidScheduleGasPrice,
  isValidScheduleGasLimit,
  isValidScheduleDeposit
} from 'selectors/schedule';
import {
  EAC_SCHEDULING_CONFIG,
  getScheduleData,
  calcEACEndowment,
  getSchedulerAddress,
  EAC_ADDRESSES,
  getValidateRequestParamsData
} from 'libs/scheduling';
import { makeTransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { getLatestBlock } from 'selectors/config';
import {
  windowSizeBlockToMin,
  calculateWindowStart,
  isWindowStartValid,
  isScheduleTimestampValid
} from 'selectors/schedule/helpers';
import { getScheduleState } from 'selectors/schedule/fields';
import { Nonce, Wei } from 'libs/units';
import { getWalletInst } from 'selectors/wallet';
import { bufferToHex } from 'ethereumjs-util';

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
