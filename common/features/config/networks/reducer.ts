import { combineReducers } from 'redux';

import * as configNetworksCustomReducer from './custom/reducer';
import * as configStaticCustomReducer from './static/reducer';
import * as types from './types';

export const networksReducer = combineReducers<types.ConfigNetworksState>({
  customNetworks: configNetworksCustomReducer.customNetworksReducer,
  staticNetworks: configStaticCustomReducer.staticNetworksReducer
});
