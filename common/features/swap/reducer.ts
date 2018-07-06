import { schema, normalize } from 'normalizr';

import * as types from './types';

export const allIds = (byIds: { [name: string]: {} }) => {
  return Object.keys(byIds);
};

export const option = new schema.Entity('options');
export const providerRate = new schema.Entity('providerRates', {
  options: [option]
});

export const INITIAL_STATE: types.SwapState = {
  step: 1,
  origin: { label: 'BTC', amount: NaN },
  destination: { label: 'ETH', amount: NaN },
  options: {
    byId: {},
    allIds: []
  },
  bityRates: {
    byId: {},
    allIds: []
  },
  shapeshiftRates: {
    byId: {},
    allIds: []
  },
  provider: 'shapeshift',
  destinationAddress: '',
  bityOrder: {},
  shapeshiftOrder: {},
  isFetchingRates: null,
  hasNotifiedRatesFailure: false,
  secondsRemaining: null,
  outputTx: null,
  isPostingOrder: false,
  bityOrderStatus: null,
  shapeshiftOrderStatus: null,
  orderTimestampCreatedISOString: null,
  paymentAddress: null,
  validFor: null,
  orderId: null,
  showLiteSend: false,
  paymentId: null,
  xmrPaymentAddress: null
};

export function swapReducer(state: types.SwapState = INITIAL_STATE, action: types.SwapAction) {
  switch (action.type) {
    case types.SwapActions.LOAD_BITY_RATES_SUCCEEDED:
      const { payload } = action;
      return {
        ...state,
        bityRates: {
          byId: normalize(payload, [providerRate]).entities.providerRates,
          allIds: allIds(normalize(payload, [providerRate]).entities.providerRates)
        },
        options: {
          byId: Object.assign(
            {},
            normalize(payload, [providerRate]).entities.options,
            state.options.byId
          ),
          allIds: [
            ...allIds(normalize(payload, [providerRate]).entities.options),
            ...state.options.allIds
          ]
        },
        isFetchingRates: false
      };
    case types.SwapActions.LOAD_SHAPESHIFT_RATES_SUCCEEDED:
      const {
        entities: { providerRates: normalizedProviderRates, options: normalizedOptions }
      } = normalize(action.payload, [providerRate]);

      return {
        ...state,
        shapeshiftRates: {
          byId: normalizedProviderRates,
          allIds: allIds(normalizedProviderRates)
        },
        options: {
          byId: { ...normalizedOptions, ...state.options.byId },
          allIds: [...allIds(normalizedOptions), ...state.options.allIds]
        },
        isFetchingRates: false
      };
    case types.SwapActions.INIT: {
      return {
        ...state,
        origin: action.payload.origin,
        destination: action.payload.destination
      };
    }
    case types.SwapActions.STEP: {
      return {
        ...state,
        step: action.payload
      };
    }
    case types.SwapActions.DESTINATION_ADDRESS:
      return {
        ...state,
        destinationAddress: action.payload
      };
    case types.SwapActions.RESTART:
      return {
        ...INITIAL_STATE,
        options: state.options,
        bityRates: state.bityRates,
        shapeshiftRates: state.shapeshiftRates
      };
    case types.SwapActions.BITY_ORDER_CREATE_REQUESTED:
      return {
        ...state,
        isPostingOrder: true
      };
    case types.SwapActions.SHAPESHIFT_ORDER_CREATE_REQUESTED:
      return {
        ...state,
        isPostingOrder: true
      };
    case types.SwapActions.BITY_ORDER_CREATE_FAILED:
      return {
        ...state,
        isPostingOrder: false
      };
    case types.SwapActions.SHAPESHIFT_ORDER_CREATE_FAILED:
      return {
        ...state,
        isPostingOrder: false
      };
    case types.SwapActions.BITY_ORDER_CREATE_SUCCEEDED:
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
        bityOrderStatus: action.payload.status,
        orderId: action.payload.id
      };
    case types.SwapActions.SHAPESHIFT_ORDER_CREATE_SUCCEEDED:
      const currDate = Date.now();
      const secondsRemaining = Math.floor((+new Date(action.payload.expiration) - currDate) / 1000);

      return {
        ...state,
        shapeshiftOrder: {
          ...action.payload
        },
        isPostingOrder: false,
        originAmount: parseFloat(action.payload.depositAmount),
        destinationAmount: parseFloat(action.payload.withdrawalAmount),
        secondsRemaining,
        validFor: secondsRemaining,
        orderTimestampCreatedISOString: new Date(currDate).toISOString(),
        paymentAddress: action.payload.deposit,
        shapeshiftOrderStatus: 'no_deposits',
        orderId: action.payload.orderId,
        // For XMR swaps
        paymentId: action.payload.deposit,
        xmrPaymentAddress: action.payload.sAddress
      };
    case types.SwapActions.BITY_ORDER_STATUS_SUCCEEDED:
      return {
        ...state,
        outputTx: action.payload.output.reference,
        bityOrderStatus:
          action.payload.output.status === 'FILL'
            ? action.payload.output.status
            : action.payload.input.status
      };
    case types.SwapActions.SHAPESHIFT_ORDER_STATUS_SUCCEEDED:
      return {
        ...state,
        outputTx: action.payload && action.payload.transaction ? action.payload.transaction : null,
        shapeshiftOrderStatus: action.payload.status
      };
    case types.SwapActions.ORDER_TIME:
      return {
        ...state,
        secondsRemaining: action.payload
      };

    case types.SwapActions.LOAD_BITY_RATES_REQUESTED:
    case types.SwapActions.LOAD_SHAPESHIFT_RATES_REQUESTED:
      return {
        ...state,
        isFetchingRates: true,
        hasNotifiedRatesFailure: false
      };
    case types.SwapActions.LOAD_BITY_RATES_FAILED:
    case types.SwapActions.LOAD_SHAPESHIFT_RATES_FAILED:
      return {
        ...state,
        hasNotifiedRatesFailure: true
      };
    case types.SwapActions.STOP_LOAD_BITY_RATES:
      return {
        ...state,
        isFetchingRates: false
      };
    case types.SwapActions.STOP_LOAD_SHAPESHIFT_RATES:
      return {
        ...state,
        isFetchingRates: false
      };
    case types.SwapActions.CHANGE_PROVIDER:
      return {
        ...state,
        provider: action.payload
      };
    case types.SwapActions.SHOW_LITE_SEND:
      return {
        ...state,
        showLiteSend: action.payload
      };
    default:
      return state;
  }
}
