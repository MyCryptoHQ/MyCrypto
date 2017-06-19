import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES
} from 'actions/swapConstants';
import { combineAndUpper } from 'api/bity';

export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];

const initialState = {
  originAmount: 0,
  destinationAmount: 0,
  originKind: 'BTC',
  destinationKind: 'ETH',
  destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(
    element => element !== 'BTC'
  ),
  originKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(
    element => element !== 'REP'
  ),
  bityRates: {}
};

const buildDestinationAmount = (
  originAmount,
  originKind,
  destinationKind,
  bityRates
) => {
  let pairName = combineAndUpper(originKind, destinationKind);
  let bityRate = bityRates[pairName];
  return originAmount * bityRate;
};

const buildDestinationKind = (originKind, destinationKind) => {
  if (originKind === destinationKind) {
    return ALL_CRYPTO_KIND_OPTIONS.filter(element => element !== originKind)[0];
  } else {
    return destinationKind;
  }
};

export function swap(state = initialState, action) {
  switch (action.type) {
    case SWAP_ORIGIN_KIND: {
      const newDestinationKind = buildDestinationKind(
        action.payload.originKind,
        state.destinationKind
      );
      return {
        ...state,
        originKind: action.payload.originKind,
        destinationKind: newDestinationKind,
        destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(
          element => element !== action.payload.originKind
        ),
        destinationAmount: buildDestinationAmount(
          state.originAmount,
          action.payload.originKind,
          newDestinationKind,
          action.payload.bityRates
        )
      };
    }
    case SWAP_DESTINATION_KIND: {
      return {
        ...state,
        destinationKind: action.payload.destinationKind,
        destinationAmount: buildDestinationAmount(
          state.originAmount,
          state.originKind,
          action.payload.destinationKind,
          action.payload.bityRates
        )
      };
    }
    case SWAP_ORIGIN_AMOUNT:
      return {
        ...state,
        originAmount: action.value
      };
    case SWAP_DESTINATION_AMOUNT:
      return {
        ...state,
        destinationAmount: action.value
      };
    case SWAP_UPDATE_BITY_RATES:
      return {
        ...state,
        bityRates: {
          ...state.bityRates,
          ...action.value
        }
      };
    default:
      return state;
  }
}
