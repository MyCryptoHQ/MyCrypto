import {isLoggedIn} from 'api/AuthSvc'
import {
    LOGIN_AUTH_FAIL,
    LOGIN_AUTH_SUCCESS,
    LOGOUT_AUTH_SUCCESS
} from 'actions/auth'

let initialState = {
    loggedIn: isLoggedIn()
}

export function auth(state = initialState, action) {
    switch (action.type) {
        case LOGOUT_AUTH_SUCCESS: {
            return {
                ...state,
                loggedIn: false
            }
        }

        case LOGIN_AUTH_FAIL: {
            return {
                ...state,
                loggedIn: false
            }
        }
        case LOGIN_AUTH_SUCCESS: {
            return {
                ...state,
                loggedIn: true
            }
        }
        default:
            return state
    }
}
