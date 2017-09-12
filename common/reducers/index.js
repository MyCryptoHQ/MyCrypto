// @flow
import * as generateWallet from './generateWallet';
import type { State as GenerateWalletState } from './generateWallet';

import * as config from './config';
import type { State as ConfigState } from './config';

import * as swap from './swap';

import * as notifications from './notifications';
import type { State as NotificationsState } from './notifications';

import * as ens from './ens';
import type { State as EnsState } from './ens/types';

import * as wallet from './wallet';
import type { State as WalletState } from './wallet';

import * as customTokens from './customTokens';
import type { State as CustomTokensState } from './customTokens';

import * as rates from './rates';
import type { State as RatesState } from './rates';

import * as contracts from './contracts';
import type { State as ContractsState } from './contracts';

import * as deterministicWallets from './deterministicWallets';
import type { State as DeterministicWalletsState } from './deterministicWallets';

import type { State as SwapState } from './swap';

import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export type State = {
  // Custom reducers
  generateWallet: GenerateWalletState,
  config: ConfigState,
  notifications: NotificationsState,
  ens: EnsState,
  wallet: WalletState,
  customTokens: CustomTokensState,
  rates: RatesState,
  contracts: ContractsState,
  deterministicWallets: DeterministicWalletsState,
  // Third party reducers (TODO: Fill these out)
  form: Object,
  routing: Object,
  swap: SwapState
};

export default combineReducers({
  ...generateWallet,
  ...config,
  ...swap,
  ...notifications,
  ...ens,
  ...wallet,
  ...customTokens,
  ...rates,
  ...contracts,
  ...deterministicWallets,
  form: formReducer,
  routing: routerReducer
});
