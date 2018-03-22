import BN from 'bn.js';
import abi from 'ethereumjs-abi';

export const EAC_SCHEDULING_CONFIG = {
  DAPP_ADDRESS: 'https://app.chronologic.network',
  FEE: new BN('2242000000000000'), // $2
  FEE_MULTIPLIER: new BN('2'),
  FUTURE_EXECUTION_COST: new BN('180000'),
  REQUIRED_DEPOSIT: 0,
  SCHEDULING_GAS_LIMIT: new BN('1500000'),
  TIME_BOUNTY_MIN: 1, // $0.1
  TIME_BOUNTY_DEFAULT: 10, // $1
  TIME_BOUNTY_MAX: 100, // $10
  TIME_BOUNTY_TO_WEI_MULTIPLIER: new BN('100000000000000'),
  WINDOW_SIZE_IN_BLOCKS: 90
};

export const EAC_ADDRESSES = {
  KOVAN: {
    blockScheduler: '0x1afc19a7e642761ba2b55d2a45b32c7ef08269d1'
  }
};

export const calcEACFutureExecutionCost = (callGas: BN, gasPrice: BN, timeBounty: BN) => {
  const totalGas = callGas.add(EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST);

  return timeBounty
    .add(EAC_SCHEDULING_CONFIG.FEE.mul(EAC_SCHEDULING_CONFIG.FEE_MULTIPLIER))
    .add(totalGas.mul(gasPrice));
};

export const calcEACEndowment = (callGas: BN, callValue: BN, gasPrice: BN, timeBounty: BN) =>
  callValue.add(calcEACFutureExecutionCost(callGas, gasPrice, timeBounty));

export const calcEACTotalCost = (callGas: BN, gasPrice: BN, timeBounty: BN) => {
  const deployCost = gasPrice.mul(EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT);

  const futureExecutionCost = calcEACFutureExecutionCost(callGas, gasPrice, timeBounty);

  return deployCost.add(futureExecutionCost);
};

export const getScheduleData = (
  toAddress: string,
  callData = '',
  callGas: number,
  callValue: BN | null,
  windowSize: number,
  windowStart: any,
  gasPrice: BN | null,
  timeBounty: any,
  requiredDeposit: any
) => {
  if (!callValue || !gasPrice || !windowStart) {
    return;
  }

  return abi.simpleEncode('schedule(address,bytes,uint[8]):(address)', toAddress, callData, [
    callGas,
    callValue,
    windowSize,
    windowStart,
    gasPrice,
    EAC_SCHEDULING_CONFIG.FEE,
    timeBounty,
    requiredDeposit
  ]);
};

export const getTXDetailsCheckURL = (txHash: string) => {
  return `${EAC_SCHEDULING_CONFIG.DAPP_ADDRESS}/awaiting/scheduler/${txHash}`;
};
