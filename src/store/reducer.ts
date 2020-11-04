import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { LSKeys } from '@types';

import entitiesReducer from './entities';
import userActionsReducer from './userActions.slice';

export default combineReducers({
  demo: demoReducer,
  entities: entitiesReducer,
  [LSKeys.USER_ACTIONS]: userActionsReducer
});
