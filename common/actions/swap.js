import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES
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
