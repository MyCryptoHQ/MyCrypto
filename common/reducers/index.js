import * as layout from './layout';
import * as inbox from './inbox'
import * as auth from './auth'
import * as loginCR from './loginCR'
import * as dashboard from './dashboard'
import * as generateWallet from './generateWallet'
import * as config from './config'

import { reducer as formReducer } from 'redux-form'

import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'

export default combineReducers({
    ...layout,
    ...inbox,
    ...auth,
    ...dashboard,
    ...loginCR,
    ...generateWallet,
    ...config,
    form: formReducer,
    routing: routerReducer
})
