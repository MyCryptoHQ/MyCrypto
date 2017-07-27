import { combineAndUpper } from 'utils/formatters';
import without from 'lodash/without';

export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];
const DEFAULT_ORIGIN_KIND = 'BTC';
const DEFAULT_DESTINATION_KIND = 'ETH';

const initialState = {
  originKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, 'REP'),
  originAmount: '',
  originKind: DEFAULT_ORIGIN_KIND,
  destinationAmount: '',
  destinationKind: DEFAULT_DESTINATION_KIND,
  destinationAddress: '',
  destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, DEFAULT_ORIGIN_KIND),
  step: 1,
  bityRates: {},
  bityOrder: {},
  isPostingOrder: false,
  secondsRemaining: null,
  orderStatus: null,
  paymentAddress: null,
  orderId: null
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
    return without(ALL_CRYPTO_KIND_OPTIONS, originKind)[0];
  } else {
    return destinationKind;
  }
};

export function swap(state = initialState, action) {
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
        }
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
        ...state,
        ...initialState,
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
        secondsRemaining: state.secondsRemaining - 1
      };
    default:
      return state;
  }
}
