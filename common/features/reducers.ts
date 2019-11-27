import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { AddressBookState } from './addressBook/types';
import { addressBookReducer } from './addressBook/reducer';
import { ConfigState } from './config/types';
import { configReducer } from './config/reducer';
import { CustomTokensState } from './customTokens/types';
import { customTokensReducer } from './customTokens/reducer';
import { DeterministicWalletsState } from './deterministicWallets/types';
import { deterministicWalletsReducer } from './deterministicWallets/reducer';
import { ENSState } from './ens/types';
import { ensReducer } from './ens/reducer';
import { GasState } from './gas/types';
import { gasReducer } from './gas/reducer';
import { MessageState } from './message/types';
import { messageReducer } from './message/reducer';
import { NotificationState } from './notifications/types';
import { notificationsReducer } from './notifications/reducer';
import { ParitySignerState } from './paritySigner/types';
import { paritySignerReducer } from './paritySigner/reducer';
import { RatesState } from './rates/types';
import { ratesReducer } from './rates/reducer';
import { WalletState } from './wallet/types';
import { walletReducer } from './wallet/reducer';
import { SidebarState } from './sidebar/types';
import { sidebarReducer } from './sidebar/reducer';

export interface AppState {
  // Custom reducers
  config: ConfigState;
  notifications: NotificationState;
  ens: ENSState;
  wallet: WalletState;
  customTokens: CustomTokensState;
  rates: RatesState;
  deterministicWallets: DeterministicWalletsState;
  message: MessageState;
  paritySigner: ParitySignerState;
  addressBook: AddressBookState;
  gas: GasState;
  sidebar: SidebarState;
  // Third party reducers (TODO: Fill these out)
  routing: any;
}

export default combineReducers<AppState>({
  config: configReducer,
  notifications: notificationsReducer,
  ens: ensReducer,
  wallet: walletReducer,
  customTokens: customTokensReducer,
  rates: ratesReducer,
  deterministicWallets: deterministicWalletsReducer,
  message: messageReducer,
  paritySigner: paritySignerReducer,
  addressBook: addressBookReducer,
  gas: gasReducer,
  sidebar: sidebarReducer,
  routing: routerReducer
});
