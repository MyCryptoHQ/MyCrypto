import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES,
  SWAP_PART_ONE_COMPLETE,
  SWAP_DESTINATION_ADDRESS,
  SWAP_RESTART,
  SWAP_PART_TWO_COMPLETE
} from 'actions/swapConstants';
import { combineAndUpper } from 'api/bity';

export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];

const initialState = {
  originAmount: '',
  destinationAmount: '',
  originKind: 'BTC',
  destinationKind: 'ETH',
  destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(
    element => element !== 'BTC'
  ),
  originKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(
    element => element !== 'REP'
  ),
  partOneComplete: false,
  partTwoComplete: false,
  bityRates: {},
  destinationAddress: ''
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
        action.value,
        state.destinationKind
      );
      return {
        ...state,
        originKind: action.value,
        destinationKind: newDestinationKind,
        destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(
          element => element !== action.value
        ),
        destinationAmount: buildDestinationAmount(
          state.originAmount,
          action.value,
          newDestinationKind,
          state.bityRates
        )
      };
    }
    case SWAP_DESTINATION_KIND: {
      return {
        ...state,
        destinationKind: action.value,
        destinationAmount: buildDestinationAmount(
          state.originAmount,
          state.originKind,
          action.value,
          state.bityRates
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
    case SWAP_PART_ONE_COMPLETE:
      return {
        ...state,
        partOneComplete: action.value
      };
    case SWAP_PART_TWO_COMPLETE:
      return {
        ...state,
        partTwoComplete: action.value
      };
    case SWAP_DESTINATION_ADDRESS:
      return {
        ...state,
        destinationAddress: action.value
      };
    case SWAP_RESTART:
      return {
        ...state,
        ...initialState,
        bityRates: state.bityRates
      };
    default:
      return state;
  }
}
