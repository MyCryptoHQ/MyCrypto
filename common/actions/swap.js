import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES,
  SWAP_DESTINATION_ADDRESS,
  SWAP_RESTART,
  SWAP_LOAD_BITY_RATES,
  SWAP_STOP_LOAD_BITY_RATES,
  SWAP_STEP,
  SWAP_REFERENCE_NUMBER
} from './swapConstants';

export type ChangeStepAction = {
  type: SWAP_STEP,
  value: number
};

export function changeStepSwap(value: number): ChangeStepAction {
  return {
    type: SWAP_STEP,
    value
  };
}

export const referenceNumberSwap = value => {
  return {
    type: SWAP_REFERENCE_NUMBER,
    value
  };
};

export const originKindSwap = value => {
  return {
    type: SWAP_ORIGIN_KIND,
    value
  };
};

export const destinationKindSwap = value => {
  return {
    type: SWAP_DESTINATION_KIND,
    value
  };
};

export const originAmountSwap = value => {
  return {
    type: SWAP_ORIGIN_AMOUNT,
    value
  };
};

export const destinationAmountSwap = value => {
  return {
    type: SWAP_DESTINATION_AMOUNT,
    value
  };
};

export const updateBityRatesSwap = value => {
  return {
    type: SWAP_UPDATE_BITY_RATES,
    value
  };
};

export const destinationAddressSwap = value => {
  return {
    type: SWAP_DESTINATION_ADDRESS,
    value
  };
};

export const restartSwap = () => {
  return {
    type: SWAP_RESTART
  };
};

export const loadBityRatesSwap = () => {
  return {
    type: SWAP_LOAD_BITY_RATES
  };
};

export const stopLoadBityRatesSwap = () => {
  return {
    type: SWAP_STOP_LOAD_BITY_RATES
  };
};
