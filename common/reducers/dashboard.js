import {GET_STATISTICS_SUCCESS, GET_STATISTICS_FAIL} from 'actions/dashboard'
import {LOCATION_CHANGE} from 'actions/common'

const initialState = {
    statistics: []
}

export function dashboard(state = initialState, action) {
    switch (action.type) {
        case GET_STATISTICS_SUCCESS:
            return {
                ...state,
                statistics: action.result
            }
        case GET_STATISTICS_FAIL:
            return state
        case LOCATION_CHANGE: {
            if (action.payload.pathname !== '/') {
                return initialState
            }
            return state
        }
        default:
            return state
    }
}
