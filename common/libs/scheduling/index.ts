import BN from 'bn.js';
import abi from 'ethereumjs-abi';
import { toWei, Units, gasPriceToBase, Address, Wei } from '../units';
import { toBuffer } from 'ethereumjs-util';
import RequestFactory from './contracts/RequestFactory';
import { ICurrentValue } from 'selectors/transaction';

const TIME_BOUNTY_MIN = Wei('1');

export const EAC_SCHEDULING_CONFIG = {
  DAPP_ADDRESS: 'https://app.chronologic.network',
  SCHEDULE_GAS_LIMIT_FALLBACK: Wei('21000'),
  SCHEDULE_GAS_PRICE_FALLBACK: 20, // Gwei
  FEE: Wei('0'),
  FUTURE_EXECUTION_COST: Wei('180000'),
  SCHEDULING_GAS_LIMIT: Wei('1500000'),
  WINDOW_SIZE_DEFAULT_TIME: 10,
  WINDOW_SIZE_DEFAULT_BLOCK: 90,
  TIME_BOUNTY_MIN,
  TIME_BOUNTY_DEFAULT: TIME_BOUNTY_MIN,
  TIME_BOUNTY_MAX: toWei('900', Units.ether.length - 1), // 900 ETH
  SCHEDULE_TIMESTAMP_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DEFAULT_SCHEDULING_METHOD: 'time',
  ALLOW_SCHEDULING_MIN_AFTER_NOW: 5
};

export const EAC_ADDRESSES = {
  KOVAN: {
    blockScheduler: '0x394ce9fe06c72f18e5a845842974f0c1224b1ff5',
    requestFactory: '0x98c128b3d8a0ac240f7b7dd4969ea0ad54f9d330',
    timestampScheduler: '0x31bbbf5180f2bd9c213e2e1d91a439677243268a'
  }
};

export const calcEACFutureExecutionCost = (
  callGas: Wei,
  callGasPrice: Wei,
  timeBounty: Wei | null
) => {
  const totalGas = callGas.add(EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST);

  if (!timeBounty) {
    timeBounty = EAC_SCHEDULING_CONFIG.TIME_BOUNTY_MIN;
  }

  return timeBounty.add(EAC_SCHEDULING_CONFIG.FEE).add(totalGas.mul(callGasPrice));
};

export const calcEACEndowment = (
  callGas: Wei | null,
  callValue: Wei | null,
  callGasPrice: Wei | null,
  timeBounty: Wei | null
) => {
  callValue = callValue || Wei('0');
  timeBounty = timeBounty || Wei('0');

  return callValue.add(
    calcEACFutureExecutionCost(
      callGas || EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK,
      callGasPrice || gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK),
      timeBounty
    )
  );
};

export const calcEACTotalCost = (
  callGas: Wei,
  gasPrice: Wei,
  callGasPrice: Wei | null,
  timeBounty: Wei | null
) => {
  if (!callGasPrice) {
    callGasPrice = gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK);
  }

  const deployCost = gasPrice.mul(EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT);

  const futureExecutionCost = calcEACFutureExecutionCost(callGas, callGasPrice, timeBounty);

  return deployCost.add(futureExecutionCost);
};

export const getScheduleData = (
  toAddress: string,
  callData: string | Buffer = '',
  callGas: Wei | null,
  callValue: Wei | null,
  windowSize: BN | null,
  windowStart: number,
  callGasPrice: Wei | null,
  timeBounty: Wei | null,
  requiredDeposit: Wei | null
) => {
  if (!requiredDeposit || requiredDeposit.lt(Wei('0'))) {
    requiredDeposit = Wei('0');
  }

  if (typeof callData === 'string') {
    callData = toBuffer(callData);
  }

  /*
   * Checks if any of these values are null or invalid
   * due to an user input.
   */
  if (
    !callValue ||
    !callGas ||
    !callGasPrice ||
    !windowStart ||
    !windowSize ||
    !timeBounty ||
    timeBounty.lt(Wei('0')) ||
    callGasPrice.lt(Wei('0')) ||
    windowSize.lt(new BN(0)) ||
    windowSize.bitLength() > 256
  ) {
    return;
  }

  return abi.simpleEncode('schedule(address,bytes,uint[8]):(address)', toAddress, callData, [
    callGas,
    callValue,
    windowSize,
    windowStart,
    callGasPrice,
    EAC_SCHEDULING_CONFIG.FEE,
    timeBounty,
    requiredDeposit
  ]);
};

enum SchedulingParamsError {
  InsufficientEndowment,
  ReservedWindowBiggerThanExecutionWindow,
  InvalidTemporalUnit,
  ExecutionWindowTooSoon,
  CallGasTooHigh,
  EmptyToAddress
}

export const parseSchedulingParametersValidity = (isValid: boolean[]) => {
  const errorsIndexMapping = [
    SchedulingParamsError.InsufficientEndowment,
    SchedulingParamsError.ReservedWindowBiggerThanExecutionWindow,
    SchedulingParamsError.InvalidTemporalUnit,
    SchedulingParamsError.ExecutionWindowTooSoon,
    SchedulingParamsError.CallGasTooHigh,
    SchedulingParamsError.EmptyToAddress
  ];

  const errors: SchedulingParamsError[] = [];

  isValid.forEach((boolIsTrue, index) => {
    if (!boolIsTrue) {
      errors.push(errorsIndexMapping[index]);
    }
  });

  return errors;
};

export const getValidateRequestParamsData = (
  toAddress: string,
  callGas: Wei,
  callValue: ICurrentValue['value'],
  windowSize: BN | null,
  windowStart: number,
  gasPrice: Wei,
  timeBounty: Wei | null,
  requiredDeposit: Wei,
  isTimestamp: boolean,
  endowment: Wei,
  fromAddress: string
): string => {
  windowSize = windowSize || new BN(0);
  timeBounty = timeBounty || Wei('0');

  const temporalUnit = isTimestamp ? 2 : 1;
  const freezePeriod = isTimestamp ? 3 * 60 : 10; // 3 minutes or 10 blocks
  const reservedWindowSize = isTimestamp ? 5 * 60 : 16; // 5 minutes or 16 blocks
  const claimWindowSize = isTimestamp ? 60 * 60 : 255; // 60 minutes or 255 blocks
  const feeRecipient = '0x0'; // stub

  return RequestFactory.validateRequestParams.encodeInput({
    _addressArgs: [fromAddress, feeRecipient, toAddress],
    _uintArgs: [
      EAC_SCHEDULING_CONFIG.FEE,
      timeBounty,
      claimWindowSize,
      freezePeriod,
      reservedWindowSize,
      temporalUnit,
      windowSize,
      windowStart,
      callGas,
      callValue,
      gasPrice,
      requiredDeposit
    ],
    _endowment: endowment
  });
};

export const getTXDetailsCheckURL = (txHash: string) => {
  return `${EAC_SCHEDULING_CONFIG.DAPP_ADDRESS}/awaiting/scheduler/${txHash}`;
};

export const getSchedulerAddress = (scheduleType: string | null): Address =>
  Address(
    scheduleType === 'time'
      ? EAC_ADDRESSES.KOVAN.timestampScheduler
      : EAC_ADDRESSES.KOVAN.blockScheduler
  );
