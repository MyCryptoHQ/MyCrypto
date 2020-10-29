import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';

import entitiesReducer from './entities';

export default combineReducers({ demo: demoReducer, entities: entitiesReducer });
