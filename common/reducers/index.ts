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
import { State as MessageState, message } from './message';
import { State as GasState, gas } from './gas';
import { onboardStatus, State as OnboardStatusState } from './onboardStatus';
import { State as TransactionsState, transactions } from './transactions';
import { schedule, State as ScheduleState } from './schedule';
import { State as ParitySignerState, paritySigner } from './paritySigner';
import { State as AddressBookState, addressBook } from './addressBook';

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
