import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { config, State as ConfigState } from './config';
import { customTokens, State as CustomTokensState } from './customTokens';
import { deterministicWallets, State as DeterministicWalletsState } from './deterministicWallets';
import { ens, State as EnsState } from './ens';
import { notifications, State as NotificationsState } from './notifications';
import { rates, State as RatesState } from './rates';
import { State as SwapState, swap } from './swap';
import { State as WalletState, wallet } from './wallet';
import { State as TransactionState, transaction } from './transaction';
import { State as GasState, gas } from './gas';
import { onboardStatus, State as OnboardStatusState } from './onboardStatus';
import { State as TransactionsState, transactions } from './transactions';
import { State as ParitySignerState, paritySigner } from './paritySigner';

export interface AppState {
  // Custom reducers
  config: ConfigState;
  notifications: NotificationsState;
  onboardStatus: OnboardStatusState;
  ens: EnsState;
  wallet: WalletState;
  customTokens: CustomTokensState;
  rates: RatesState;
  deterministicWallets: DeterministicWalletsState;
  swap: SwapState;
  transaction: TransactionState;
  transactions: TransactionsState;
  paritySigner: ParitySignerState;
  gas: GasState;
  // Third party reducers (TODO: Fill these out)
  routing: any;
}

export default combineReducers<AppState>({
  config,
  swap,
  notifications,
  onboardStatus,
  ens,
  wallet,
  customTokens,
  rates,
  deterministicWallets,
  transaction,
  transactions,
  paritySigner,
  gas,
  routing: routerReducer
});
