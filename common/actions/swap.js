import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES,
  SWAP_PART_ONE_COMPLETE,
  SWAP_PART_TWO_COMPLETE,
  SWAP_DESTINATION_ADDRESS,
  SWAP_RESTART,
  SWAP_LOAD_BITY_RATES,
  SWAP_STOP_LOAD_BITY_RATES
} from './swapConstants';

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

export const partOneCompleteSwap = (value: boolean) => {
  return {
    type: SWAP_PART_ONE_COMPLETE,
    value
  };
};

export const partTwoCompleteSwap = (value: boolean) => {
  return {
    type: SWAP_PART_TWO_COMPLETE,
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

export const loadBityRates = () => {
  return {
    type: SWAP_LOAD_BITY_RATES
  };
};

export const stopLoadBityRates = () => {
  return {
    type: SWAP_STOP_LOAD_BITY_RATES
  };
};
