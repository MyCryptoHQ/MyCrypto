import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { ConfigState } from './config/types';
import { configReducer } from './config/reducer';
import { CustomTokensState } from './customTokens/types';
import { customTokensReducer } from './customTokens/reducer';
import { ParitySignerState } from './paritySigner/types';
import { paritySignerReducer } from './paritySigner/reducer';
import { SidebarState } from './sidebar/types';
import { sidebarReducer } from './sidebar/reducer';

export interface AppState {
  // Custom reducers
  config: ConfigState;
  customTokens: CustomTokensState;
  paritySigner: ParitySignerState;
  sidebar: SidebarState;
  // Third party reducers (TODO: Fill these out)
  routing: any;
}

export default combineReducers<AppState>({
  config: configReducer,
  customTokens: customTokensReducer,
  paritySigner: paritySignerReducer,
  sidebar: sidebarReducer,
  routing: routerReducer
});
