import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES
} from './swapConstants';

export const swapOriginKind = value => {
  return {
    type: SWAP_ORIGIN_KIND,
    value
  };
};

export const swapDestinationKind = value => {
  return {
    type: SWAP_DESTINATION_KIND,
    value
  };
};

export const swapOriginAmount = value => {
  return {
    type: SWAP_ORIGIN_AMOUNT,
    value
  };
};

export const swapDestinationAmount = value => {
  return {
    type: SWAP_DESTINATION_AMOUNT,
    value
  };
};

export const swapUpdateBityRates = value => {
  return {
    type: SWAP_UPDATE_BITY_RATES,
    value
  };
};
