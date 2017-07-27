// @flow
import { combineAndUpper } from 'utils/formatters';
import type { SwapAction } from 'actions/swap';

export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];

type State = {
  originAmount: number,
  destinationAmount: number,
  originKind: string,
  destinationKind: string,
  destinationKindOptions: Array<string>,
  originKindOptions: Array<string>,
  step: number,
  bityRates: Object,
  destinationAddress: string,
  referenceNumber: string,
  timeRemaining: string,
  numberOfConfirmations: ?number,
  orderStep: ?number,
  isFetchingRates: boolean
};

export const INITIAL_STATE: State = {
  originAmount: 0,
  destinationAmount: 0,
  originKind: 'BTC',
  destinationKind: 'ETH',
  destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(element => {
    return element !== 'BTC';
  }),
  originKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(element => {
    return element !== 'REP';
  }),
  step: 1,
  bityRates: {},
  destinationAddress: '',
  referenceNumber: '',
  timeRemaining: '',
  numberOfConfirmations: null,
  orderStep: null,
  isFetchingRates: false
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

const buildDestinationKind = (
  originKind: string,
  destinationKind: string
): string => {
  if (originKind === destinationKind) {
    return ALL_CRYPTO_KIND_OPTIONS.filter(element => element !== originKind)[0];
  } else {
    return destinationKind;
  }
};

export function swap(state: State = INITIAL_STATE, action: SwapAction) {
  switch (action.type) {
    case 'SWAP_ORIGIN_KIND': {
      const newDestinationKind = buildDestinationKind(
        action.value,
        state.destinationKind
      );
      return {
        ...state,
        originKind: action.value,
        destinationKind: newDestinationKind,
        destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(element => {
          // $FlowFixMe
          return element !== action.value;
        }),
        destinationAmount: buildDestinationAmount(
          state.originAmount,
          action.value,
          newDestinationKind,
          state.bityRates
        )
      };
    }
    case 'SWAP_DESTINATION_KIND': {
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
    case 'SWAP_ORIGIN_AMOUNT':
      return {
        ...state,
        originAmount: action.value
      };
    case 'SWAP_DESTINATION_AMOUNT':
      return {
        ...state,
        destinationAmount: action.value
      };
    case 'SWAP_UPDATE_BITY_RATES':
      return {
        ...state,
        bityRates: {
          ...state.bityRates,
          ...action.value
        },
        isFetchingRates: false
      };
    case 'SWAP_STEP': {
      return {
        ...state,
        step: action.value
      };
    }
    case 'SWAP_DESTINATION_ADDRESS':
      return {
        ...state,
        destinationAddress: action.value
      };
    case 'SWAP_RESTART':
      return {
        ...INITIAL_STATE,
        bityRates: state.bityRates
      };
    case 'SWAP_REFERENCE_NUMBER':
      return {
        ...state,
        referenceNumber: '2341asdfads',
        timeRemaining: '2:30',
        numberOfConfirmations: 3,
        orderStep: 2
      };

    case 'SWAP_LOAD_BITY_RATES':
      return {
        ...state,
        isFetchingRates: true
      };

    case 'SWAP_STOP_LOAD_BITY_RATES':
      return {
        ...state,
        isFetchingRates: false
      };

    default:
      (action: empty);
      return state;
  }
}
