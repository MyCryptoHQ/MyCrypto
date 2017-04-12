import {
    login_API,
    setLocalToken,
    resetLocalToken
} from 'api/AuthSvc';
import {resultOK} from 'api/utils';

export const LOGIN_AUTH_SUCCESS = 'LOGIN_AUTH_SUCCESS'
export const LOGIN_AUTH_FAIL = 'LOGIN_AUTH_FAIL'

export const LOGOUT_AUTH_SUCCESS = 'LOGOUT_AUTH_SUCCESS'

export function LOGIN_AUTH(data) {
    return async () => {
        let result = await login_API(data)
        if (!resultOK(result)) {
            return {type: LOGIN_AUTH_FAIL, error: result.data}
        }
        setLocalToken(result.token)
        return {type: LOGIN_AUTH_SUCCESS, result: result.data}
    }
}

export function LOGOUT_AUTH() {
    resetLocalToken()
    return {type: LOGOUT_AUTH_SUCCESS}
}
