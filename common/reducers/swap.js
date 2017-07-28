// @flow
import { combineAndUpper } from 'utils/formatters';
import type { SwapAction } from 'actions/swapTypes';
import without from 'lodash/without';
export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];
const DEFAULT_ORIGIN_KIND = 'BTC';
const DEFAULT_DESTINATION_KIND = 'ETH';

type State = {
  originAmount: ?number,
  destinationAmount: ?number,
  originKind: string,
  destinationKind: string,
  destinationKindOptions: Array<string>,
  originKindOptions: Array<string>,
  step: number,
  bityRates: Object,
  destinationAddress: string,
  numberOfConfirmations: ?number,
  step: ?number,
  isFetchingRates: ?boolean,
  secondsRemaining: ?number
};

export const INITIAL_STATE: State = {
  originAmount: null,
  originKind: DEFAULT_ORIGIN_KIND,
  destinationAmount: null,
  destinationKind: DEFAULT_DESTINATION_KIND,
  destinationAddress: '',
  destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, DEFAULT_ORIGIN_KIND),
  originKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, 'REP'),
  step: 1,
  bityRates: {},
  bityOrder: {},
  isPostingOrder: false,
  secondsRemaining: null,
  orderStatus: null,
  paymentAddress: null,
  orderId: null,
  isFetchingRates: null,
  numberOfConfirmations: null
};

const buildDestinationAmount = (
  originAmount,
  originKind,
  destinationKind,
  bityRates
) => {
  let pairName = combineAndUpper(originKind, destinationKind);
  let bityRate = bityRates[pairName];
  return originAmount ? originAmount * bityRate : 0;
};

const buildDestinationKind = (
  originKind: string,
  destinationKind: string
): string => {
  if (originKind === destinationKind) {
    return without(ALL_CRYPTO_KIND_OPTIONS, originKind)[0];
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
    case 'SWAP_LOAD_BITY_RATES_SUCCEEDED':
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
    case 'SWAP_ORDER_CREATE_REQUESTED':
      return {
        ...state,
        isPostingOrder: true
      };
    case 'SWAP_ORDER_CREATE_FAILED':
      return {
        ...state,
        isPostingOrder: false
      };
    case 'SWAP_ORDER_CREATE_SUCCEEDED':
      return {
        ...state,
        bityOrder: {
          ...action.payload
        },
        isPostingOrder: false,
        originAmount: parseFloat(action.payload.input.amount),
        destinationAmount: parseFloat(action.payload.output.amount),
        secondsRemaining: action.payload.validFor,
        paymentAddress: action.payload.payment_address,
        orderStatus: action.payload.status,
        orderId: action.payload.id
      };
    case 'SWAP_BITY_ORDER_STATUS_SUCCEEDED':
      return {
        ...state,
        orderStatus: action.payload.status
      };
    case 'SWAP_ORDER_TIME_TICK':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining
          ? state.secondsRemaining - 1
          : state.secondsRemaining
      };

    case 'SWAP_LOAD_BITY_RATES_REQUESTED':
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
