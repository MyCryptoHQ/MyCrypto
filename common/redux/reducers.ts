import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import config, { State as ConfigState } from './config';
import notifications, { State as NotificationsState } from './notifications';
import onboardStatus, { State as OnboardStatusState } from './onboardStatus';
import ens, { State as EnsState } from './ens';
import wallet, { State as WalletState } from './wallet';
import customTokens, { State as CustomTokensState } from './customTokens';
import rates, { State as RatesState } from './rates';
import deterministicWallets, { State as DeterministicWalletsState } from './deterministicWallets';
import swap, { State as SwapState } from './swap';
import transaction, { State as TransactionState } from './transaction';
import transactions, { State as TransactionsState } from './transactions';
import message, { State as MessageState } from './message';
import paritySigner, { State as ParitySignerState } from './paritySigner';
import addressBook, { State as AddressBookState } from './addressBook';
import gas, { State as GasState } from './gas';
import schedule, { State as ScheduleState } from './schedule';

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
  message: MessageState;
  paritySigner: ParitySignerState;
  addressBook: AddressBookState;
  gas: GasState;
  schedule: ScheduleState;
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
  message,
  paritySigner,
  addressBook,
  gas,
  schedule,
  routing: routerReducer
});
