import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { ConfigState } from './config/types';
import { configReducer } from './config/reducer';
import { CustomTokensState } from './customTokens/types';
import { customTokensReducer } from './customTokens/reducer';
import { ENSState } from './ens/types';
import { ensReducer } from './ens/reducer';
import { GasState } from './gas/types';
import { gasReducer } from './gas/reducer';
import { NotificationState } from './notifications/types';
import { notificationsReducer } from './notifications/reducer';
import { ParitySignerState } from './paritySigner/types';
import { paritySignerReducer } from './paritySigner/reducer';
import { RatesState } from './rates/types';
import { ratesReducer } from './rates/reducer';
import { SidebarState } from './sidebar/types';
import { sidebarReducer } from './sidebar/reducer';

export interface AppState {
  // Custom reducers
  config: ConfigState;
  notifications: NotificationState;
  ens: ENSState;
  customTokens: CustomTokensState;
  rates: RatesState;
  paritySigner: ParitySignerState;
  gas: GasState;
  sidebar: SidebarState;
  // Third party reducers (TODO: Fill these out)
  routing: any;
}

export default combineReducers<AppState>({
  config: configReducer,
  notifications: notificationsReducer,
  ens: ensReducer,
  customTokens: customTokensReducer,
  rates: ratesReducer,
  paritySigner: paritySignerReducer,
  gas: gasReducer,
  sidebar: sidebarReducer,
  routing: routerReducer
});
