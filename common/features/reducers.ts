import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { ConfigState, configReducer } from './config';
import { notificationsReducer, NotificationState } from './notifications';
import { OnboardStatusState, onboardStatusReducer } from './onboardStatus';
import { ENSState, ensReducer } from './ens';
import { walletReducer, WalletState } from './wallet';
import { customTokensReducer, CustomTokensState } from './customTokens';
import { ratesReducer, RatesState } from './rates';
import { deterministicWalletsReducer, DeterministicWalletsState } from './deterministicWallets';
import { swapReducer, SwapState } from './swap';
import transaction, { State as TransactionState } from './transaction/reducers';
import { transactionsReducer, TransactionsState } from './transactions';
import { messageReducer, MessageState } from './message';
import { paritySignerReducer, ParitySignerState } from './paritySigner';
import { addressBookReducer, AddressBookState } from './addressBook';
import { gasReducer, GasState } from './gas';
import { scheduleReducer, ScheduleState } from './schedule';

export interface AppState {
  // Custom reducers
  config: ConfigState;
  notifications: NotificationState;
  onboardStatus: OnboardStatusState;
  ens: ENSState;
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
  config: configReducer,
  swap: swapReducer,
  notifications: notificationsReducer,
  onboardStatus: onboardStatusReducer,
  ens: ensReducer,
  wallet: walletReducer,
  customTokens: customTokensReducer,
  rates: ratesReducer,
  deterministicWallets: deterministicWalletsReducer,
  transaction,
  transactions: transactionsReducer,
  message: messageReducer,
  paritySigner: paritySignerReducer,
  addressBook: addressBookReducer,
  gas: gasReducer,
  schedule: scheduleReducer,
  routing: routerReducer
});
