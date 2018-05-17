import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import config, { State as ConfigState } from './config/reducers';
import notifications, { State as NotificationsState } from './notifications/reducers';
import onboardStatus, { State as OnboardStatusState } from './onboardStatus/reducers';
import ens, { State as EnsState } from './ens/reducers';
import wallet, { State as WalletState } from './wallet/reducers';
import customTokens, { State as CustomTokensState } from './customTokens/reducers';
import rates, { State as RatesState } from './rates/reducers';
import deterministicWallets, {
  State as DeterministicWalletsState
} from './deterministicWallets/reducers';
import swap, { State as SwapState } from './swap/reducers';
import transaction, { State as TransactionState } from './transaction/reducers';
import transactions, { State as TransactionsState } from './transactions/reducers';
import message, { State as MessageState } from './message/reducers';
import paritySigner, { State as ParitySignerState } from './paritySigner/reducers';
import addressBook, { State as AddressBookState } from './addressBook/reducers';
import gas, { State as GasState } from './gas/reducers';
import schedule, { State as ScheduleState } from './schedule/reducers';

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
