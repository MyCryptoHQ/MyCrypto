// @flow
import * as generateWallet from './generateWallet'
import * as config from './config'
import * as swap from './swap'
import * as notifications from './notifications'

import { reducer as formReducer } from 'redux-form'
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'

export default combineReducers({
    ...generateWallet,
    ...config,
    ...swap,
    ...notifications,
    form: formReducer,
    routing: routerReducer
})
