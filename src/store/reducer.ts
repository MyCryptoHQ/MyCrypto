import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';

export default combineReducers({ demo: demoReducer });
