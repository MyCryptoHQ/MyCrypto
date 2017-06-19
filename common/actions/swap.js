import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES
} from './swapConstants';

export const SWAP_ORIGIN_KIND_TO = value => {
  return {
    type: SWAP_ORIGIN_KIND,
    value
  };
};

export const SWAP_DESTINATION_KIND_TO = value => {
  return {
    type: SWAP_DESTINATION_KIND,
    value
  };
};

export const SWAP_ORIGIN_AMOUNT_TO = value => {
  return {
    type: SWAP_ORIGIN_AMOUNT,
    value
  };
};

export const SWAP_DESTINATION_AMOUNT_TO = value => {
  return {
    type: SWAP_DESTINATION_AMOUNT,
    value
  };
};

export const SWAP_UPDATE_BITY_RATES_TO = value => {
  return {
    type: SWAP_UPDATE_BITY_RATES,
    value
  };
};
