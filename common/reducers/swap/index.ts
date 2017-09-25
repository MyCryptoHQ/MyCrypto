import * as actionTypes from 'actions/swap';
import { TypeKeys } from 'actions/swap/constants';
import without from 'lodash/without';
import {
  buildDestinationAmount,
  buildDestinationKind,
  buildOriginKind
} from './helpers';
export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];
const DEFAULT_ORIGIN_KIND = 'BTC';
const DEFAULT_DESTINATION_KIND = 'ETH';

export interface State {
  originAmount: number | null;
  destinationAmount: number | null;
  originKind: string;
  destinationKind: string;
  destinationKindOptions: string[];
  originKindOptions: string[];
  step: number;
  bityRates: any;
  bityOrder: any;
  destinationAddress: string;
  isFetchingRates: boolean | null;
  secondsRemaining: number | null;
  outputTx: string | null;
  isPostingOrder: boolean;
  orderStatus: string | null;
  orderTimestampCreatedISOString: string | null;
  paymentAddress: string | null;
  validFor: number | null;
  orderId: string | null;
}

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

function handleSwapOriginKind(
  state: State,
  action: actionTypes.OriginKindSwapAction
) {
  const newDestinationKind = buildDestinationKind(
    action.payload,
    state.destinationKind
  );
  return {
    ...state,
    originKind: action.payload,
    destinationKind: newDestinationKind,
    destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, action.payload),
    destinationAmount: buildDestinationAmount(
      state.originAmount,
      action.payload,
      newDestinationKind,
      state.bityRates
    )
  };
}

function handleSwapDestinationKind(
  state: State,
  action: actionTypes.DestinationKindSwapAction
) {
  const newOriginKind = buildOriginKind(state.originKind, action.payload);
  return {
    ...state,
    originKind: newOriginKind,
    destinationKind: action.payload,
    destinationAmount: buildDestinationAmount(
      state.originAmount,
      state.originKind,
      action.payload,
      state.bityRates
    )
  };
}

export function swap(
  state: State = INITIAL_STATE,
  action: actionTypes.SwapAction
) {
  switch (action.type) {
    case TypeKeys.SWAP_ORIGIN_KIND: {
      return handleSwapOriginKind(state, action);
    }
    case TypeKeys.SWAP_DESTINATION_KIND: {
      return handleSwapDestinationKind(state, action);
    }
    case TypeKeys.SWAP_ORIGIN_AMOUNT:
      return {
        ...state,
        originAmount: action.payload
      };
    case TypeKeys.SWAP_DESTINATION_AMOUNT:
      return {
        ...state,
        destinationAmount: action.payload
      };
    case TypeKeys.SWAP_LOAD_BITY_RATES_SUCCEEDED:
      return {
        ...state,
        bityRates: {
          ...state.bityRates,
          ...action.payload
        },
        isFetchingRates: false
      };
    case TypeKeys.SWAP_STEP: {
      return {
        ...state,
        step: action.payload
      };
    }
    case TypeKeys.SWAP_DESTINATION_ADDRESS:
      return {
        ...state,
        destinationAddress: action.payload
      };
    case TypeKeys.SWAP_RESTART:
      return {
        ...INITIAL_STATE,
        bityRates: state.bityRates
      };
    case TypeKeys.SWAP_ORDER_CREATE_REQUESTED:
      return {
        ...state,
        isPostingOrder: true
      };
    case TypeKeys.SWAP_ORDER_CREATE_FAILED:
      return {
        ...state,
        isPostingOrder: false
      };
    // TODO - fix bad naming
    case TypeKeys.SWAP_BITY_ORDER_CREATE_SUCCEEDED:
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
    case TypeKeys.SWAP_BITY_ORDER_STATUS_SUCCEEDED:
      return {
        ...state,
        outputTx: action.payload.output.reference,
        orderStatus:
          action.payload.output.status === 'FILL'
            ? action.payload.output.status
            : action.payload.input.status
      };
    case TypeKeys.SWAP_ORDER_TIME:
      return {
        ...state,
        secondsRemaining: action.payload
      };

    case TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED:
      return {
        ...state,
        isFetchingRates: true
      };

    case TypeKeys.SWAP_STOP_LOAD_BITY_RATES:
      return {
        ...state,
        isFetchingRates: false
      };

    default:
      return state;
  }
}
