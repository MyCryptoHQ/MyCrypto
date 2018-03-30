import BN from 'bn.js';
import abi from 'ethereumjs-abi';
import { toWei, Units } from './units';

const TIME_BOUNTY_MIN = new BN('1');

export const EAC_SCHEDULING_CONFIG = {
  DAPP_ADDRESS: 'https://app.chronologic.network',
  SCHEDULE_GAS_LIMIT_FALLBACK: new BN('21000'),
  SCHEDULE_GAS_PRICE_FALLBACK: 20, // Gwei
  FEE: new BN('2242000000000000'), // $2
  FEE_MULTIPLIER: new BN('2'),
  FUTURE_EXECUTION_COST: new BN('180000'),
  REQUIRED_DEPOSIT: 0,
  SCHEDULING_GAS_LIMIT: new BN('1500000'),
  TIME_BOUNTY_MIN,
  TIME_BOUNTY_DEFAULT: TIME_BOUNTY_MIN,
  TIME_BOUNTY_MAX: toWei('900', Units.ether.length - 1), // 900 ETH
  SCHEDULE_TIMESTAMP_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DEFAULT_SCHEDULING_METHOD: 'time'
};

export const EAC_ADDRESSES = {
  KOVAN: {
    blockScheduler: '0x1afc19a7e642761ba2b55d2a45b32c7ef08269d1',
    timestampScheduler: '0xc6370807f0164bdf10a66c08d0dab1028dbe80a3'
  }
};

export const calcEACFutureExecutionCost = (
  callGas: BN,
  callGasPrice: BN,
  timeBounty: BN | null
) => {
  const totalGas = callGas.add(EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST);

  if (!timeBounty) {
    timeBounty = EAC_SCHEDULING_CONFIG.TIME_BOUNTY_MIN;
  }

  return timeBounty
    .add(EAC_SCHEDULING_CONFIG.FEE.mul(EAC_SCHEDULING_CONFIG.FEE_MULTIPLIER))
    .add(totalGas.mul(callGasPrice));
};

export const calcEACEndowment = (callGas: BN, callValue: BN, callGasPrice: BN, timeBounty: BN) =>
  callValue.add(calcEACFutureExecutionCost(callGas, callGasPrice, timeBounty));

export const calcEACTotalCost = (
  callGas: BN,
  gasPrice: BN,
  callGasPrice: BN,
  timeBounty: BN | null
) => {
  const deployCost = gasPrice.mul(EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT);

  const futureExecutionCost = calcEACFutureExecutionCost(callGas, callGasPrice, timeBounty);

  return deployCost.add(futureExecutionCost);
};

export const getScheduleData = (
  toAddress: string,
  callData = '',
  callGas: BN | null,
  callValue: BN | null,
  windowSize: number | null,
  windowStart: any,
  callGasPrice: BN | null,
  timeBounty: BN | null,
  requiredDeposit: any
) => {
  if (
    !callValue ||
    !callGas ||
    !callGasPrice ||
    !windowStart ||
    !windowSize ||
    !timeBounty ||
    timeBounty.lt(new BN(0)) ||
    callGasPrice.lt(new BN(0)) ||
    windowSize < 0
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

export const getTXDetailsCheckURL = (txHash: string) => {
  return `${EAC_SCHEDULING_CONFIG.DAPP_ADDRESS}/awaiting/scheduler/${txHash}`;
};
