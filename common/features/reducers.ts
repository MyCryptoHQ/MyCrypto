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
import { OnboardStatusState } from './onboardStatus/types';
import { onboardStatusReducer } from './onboardStatus/reducer';
import { ParitySignerState } from './paritySigner/types';
import { paritySignerReducer } from './paritySigner/reducer';
import { RatesState } from './rates/types';
import { ratesReducer } from './rates/reducer';
import { ScheduleState } from './schedule/types';
import { scheduleReducer } from './schedule/reducer';
import { SwapState } from './swap/types';
import { swapReducer } from './swap/reducer';
import { TransactionState } from './transaction/types';
import { transactionReducer } from './transaction/reducer';
import { TransactionsState } from './transactions/types';
import { transactionsReducer } from './transactions/reducer';
import { WalletState } from './wallet/types';
import { walletReducer } from './wallet/reducer';

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
  transaction: transactionReducer,
  transactions: transactionsReducer,
  message: messageReducer,
  paritySigner: paritySignerReducer,
  addressBook: addressBookReducer,
  gas: gasReducer,
  schedule: scheduleReducer,
  routing: routerReducer
});
