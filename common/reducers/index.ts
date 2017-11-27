import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { config, State as ConfigState } from './config';
import { customTokens, State as CustomTokensState } from './customTokens';
import {
  deterministicWallets,
  State as DeterministicWalletsState
} from './deterministicWallets';
import { ens, State as EnsState } from './ens';
import { generateWallet, State as GenerateWalletState } from './generateWallet';
import { notifications, State as NotificationsState } from './notifications';
import { rates, State as RatesState } from './rates';
import { State as SwapState, swap } from './swap';
import { State as WalletState, wallet } from './wallet';
export interface AppState {
  // Custom reducers
  generateWallet: GenerateWalletState;
  config: ConfigState;
  notifications: NotificationsState;
  ens: EnsState;
  wallet: WalletState;
  customTokens: CustomTokensState;
  rates: RatesState;
  deterministicWallets: DeterministicWalletsState;
  // Third party reducers (TODO: Fill these out)
  form: any;
  routing: any;
  swap: SwapState;
}

export default combineReducers({
  generateWallet,
  config,
  swap,
  notifications,
  ens,
  wallet,
  customTokens,
  rates,
  deterministicWallets,
  routing: routerReducer
});
