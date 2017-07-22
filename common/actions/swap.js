// @flow
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

import * as swapTypes from './swapTypes';

export function changeStepSwap(value: number): swapTypes.ChangeStepSwapAction {
  return {
    type: SWAP_STEP,
    value
  };
}

export function referenceNumberSwap(
  value: string
): swapTypes.ReferenceNumberSwapAction {
  return {
    type: SWAP_REFERENCE_NUMBER,
    value
  };
}

export const originKindSwap = (
  value: string
): swapTypes.OriginKindSwapAction => {
  return {
    type: SWAP_ORIGIN_KIND,
    value
  };
};

export const destinationKindSwap = (
  value: string
): swapTypes.DestinationKindSwapAction => {
  return {
    type: SWAP_DESTINATION_KIND,
    value
  };
};

export const originAmountSwap = (
  value: ?number
): swapTypes.OriginAmountSwapAction => {
  return {
    type: SWAP_ORIGIN_AMOUNT,
    value
  };
};

export const destinationAmountSwap = (
  value: ?number
): swapTypes.DestinationAmountSwapAction => {
  return {
    type: SWAP_DESTINATION_AMOUNT,
    value
  };
};

export const updateBityRatesSwap = (
  value: swapTypes.Pairs
): swapTypes.BityRatesSwapAction => {
  return {
    type: SWAP_UPDATE_BITY_RATES,
    value
  };
};

export const destinationAddressSwap = (
  value: ?string
): swapTypes.DestinationAddressSwapAction => {
  return {
    type: SWAP_DESTINATION_ADDRESS,
    value
  };
};

export const restartSwap = (): swapTypes.RestartSwapAction => {
  return {
    type: SWAP_RESTART
  };
};

export const loadBityRatesSwap = (): swapTypes.LoadBityRatesSwapAction => {
  return {
    type: SWAP_LOAD_BITY_RATES
  };
};

export const stopLoadBityRatesSwap = (): swapTypes.StopLoadBityRatesSwapAction => {
  return {
    type: SWAP_STOP_LOAD_BITY_RATES
  };
};
