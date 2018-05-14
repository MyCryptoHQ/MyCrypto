import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { State as SwapState, swap } from './swap';
import { State as TransactionState, transaction } from './transaction';

import addressBook, { State as AddressBookState } from 'redux/addressBook';
import notifications, { State as NotificationsState } from 'redux/notifications';
import customTokens, { State as CustomTokensState } from 'redux/customTokens';
import deterministicWallets, {
  State as DeterministicWalletsState
} from 'redux/deterministicWallets';
import gas, { State as GasState } from 'redux/gas';
import message, { State as MessageState } from 'redux/message';
import onboardStatus, { State as OnboardStatusState } from 'redux/onboardStatus';
import paritySigner, { State as ParitySignerState } from 'redux/paritySigner';
import rates, { State as RatesState } from 'redux/rates';
import transactions, { State as TransactionsState } from 'redux/transactions';
import wallet, { State as WalletState } from 'redux/wallet';
import config, { State as ConfigState } from 'redux/config';
import ens, { State as EnsState } from 'redux/ens';
import schedule, { State as ScheduleState } from 'redux/schedule';

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
