import {
    SWAP_DESTINATION_AMOUNT,
    SWAP_DESTINATION_KIND,
    SWAP_ORIGIN_AMOUNT,
    SWAP_ORIGIN_KIND,
    SWAP_UPDATE_BITY_RATES
} from 'actions/swap';

export const ALL_CRYPTO_KIND_OPTIONS = ['BTC', 'ETH', 'REP'];


const initialState = {
    originAmount: 0,
    destinationAmount: 0,
    originKind: 'BTC',
    destinationKind: 'ETH',
    destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(element => element !== 'BTC'),
    originKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(element => element !== 'REP'),
    bityRates: {}
};


export function swap(state = initialState, action) {
    switch (action.type) {
        case SWAP_ORIGIN_KIND: {
            return {
                ...state,
                originKind: action.value,
                destinationKind: action.value === state.destinationKind ? ALL_CRYPTO_KIND_OPTIONS.filter(element => element !== action.value)[0] : state.destinationKind,
                destinationKindOptions: ALL_CRYPTO_KIND_OPTIONS.filter(element => element !== action.value)
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
