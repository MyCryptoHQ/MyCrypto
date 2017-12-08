import * as actionTypes from 'actions/swap';
import * as stateTypes from './types';
import * as schema from './schema';
import { TypeKeys } from 'actions/swap/constants';
import { normalize } from 'normalizr';

export interface State {
  step: number;
  origin: stateTypes.SwapInput;
  destination: stateTypes.SwapInput;
  options: stateTypes.NormalizedOptions;
  bityRates: stateTypes.NormalizedBityRates;
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
  step: 1,
  origin: { id: 'BTC', amount: NaN },
  destination: { id: 'ETH', amount: NaN },
  options: {
    byId: {},
    allIds: []
  },
  bityRates: {
    byId: {},
    allIds: []
  },
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

export function swap(state: State = INITIAL_STATE, action: actionTypes.SwapAction) {
  switch (action.type) {
    case TypeKeys.SWAP_LOAD_BITY_RATES_SUCCEEDED:
      const { payload } = action;
      return {
        ...state,
        bityRates: {
          byId: normalize(payload, [schema.bityRate]).entities.bityRates,
          allIds: schema.allIds(normalize(payload, [schema.bityRate]).entities.bityRates)
        },
        options: {
          byId: normalize(payload, [schema.bityRate]).entities.options,
          allIds: schema.allIds(normalize(payload, [schema.bityRate]).entities.options)
        },
        isFetchingRates: false
      };
    case TypeKeys.SWAP_INIT: {
      return {
        ...state,
        origin: action.payload.origin,
        destination: action.payload.destination
      };
    }
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
