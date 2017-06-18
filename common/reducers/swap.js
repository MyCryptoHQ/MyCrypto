import {
    SWAP_DESTINATION_AMOUNT,
    SWAP_DESTINATION_KIND,
    SWAP_ORIGIN_AMOUNT,
    SWAP_ORIGIN_KIND,
    SWAP_UPDATE_BITY_RATES
} from 'actions/swap';

import without from 'lodash/without';
const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];

const initialState = {
    originAmount: 0,
    destinationAmount: 0,
    originKind: 'BTC',
    destinationKind: 'ETH',
    destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, 'BTC'),
    originKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, 'REP'),
    bityRates: {}
};


export function swap(state = initialState, action) {
    switch (action.type) {
        case SWAP_ORIGIN_KIND: {
            return {
                ...state,
                originKind: action.value,
                destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, action.value),
                destinationKind: without(ALL_CRYPTO_KIND_OPTIONS, action.value)[0]
            };
        }
        case SWAP_DESTINATION_KIND: {
            return {
                ...state,
                destinationKind: action.value
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
            return state
    }
}
