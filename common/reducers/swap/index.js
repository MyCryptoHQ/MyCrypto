// @flow
import type { SwapAction } from 'actions/swapTypes';
import without from 'lodash/without';
import {
  buildDestinationAmount,
  buildDestinationKind,
  buildOriginKind
} from './helpers';
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
  isFetchingRates: ?boolean,
  secondsRemaining: ?number,
  outputTx: ?string,
  isPostingOrder: ?boolean,
  orderStatus: ?string,
  orderTimestampCreatedISOString: ?string,
  paymentAddress: ?string,
  validFor: ?number,
  orderId: ?string
};

export const INITIAL_STATE: State = {
  originAmount: null,
  destinationAmount: null,
  originKind: DEFAULT_ORIGIN_KIND,
  destinationKind: DEFAULT_DESTINATION_KIND,
  destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, DEFAULT_ORIGIN_KIND),
  originKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, 'REP'),
  step: 1,
  bityRates: {},
  destinationAddress: '',
  bityOrder: {},
  isFetchingRates: null,
  secondsRemaining: null,
  outputTx: null,
  isPostingOrder: false,
  orderStatus: null,
  orderTimestampCreatedISOString: null,
  paymentAddress: null,
  validFor: null,
  orderId: null
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
        destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, action.value),
        destinationAmount: buildDestinationAmount(
          state.originAmount,
          action.value,
          newDestinationKind,
          state.bityRates
        )
      };
    }
    case 'SWAP_DESTINATION_KIND': {
      const newOriginKind = buildOriginKind(state.originKind, action.value);
      return {
        ...state,
        originKind: newOriginKind,
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
    // TODO - fix bad naming
    case 'SWAP_BITY_ORDER_CREATE_SUCCEEDED':
      return {
        ...state,
        bityOrder: {
          ...action.payload
        },
        isPostingOrder: false,
        originAmount: parseFloat(action.payload.input.amount),
        destinationAmount: parseFloat(action.payload.output.amount),
        secondsRemaining: action.payload.validFor, // will get update
        validFor: action.payload.validFor, // to build from local storage
        orderTimestampCreatedISOString: action.payload.timestamp_created,
        paymentAddress: action.payload.payment_address,
        orderStatus: action.payload.status,
        orderId: action.payload.id
      };
    case 'SWAP_BITY_ORDER_STATUS_SUCCEEDED':
      return {
        ...state,
        outputTx: action.payload.output.reference,
        orderStatus:
          action.payload.output.status === 'FILL'
            ? action.payload.output.status
            : action.payload.input.status
      };
    case 'SWAP_ORDER_TIME':
      return {
        ...state,
        secondsRemaining: action.value
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
      return state;
  }
}
