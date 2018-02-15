import { ConfigAction } from './config';
import { CustomTokenAction } from './customTokens';
import { DeterministicWalletAction } from './deterministicWallets';
import { EnsAction } from './ens';
import { NotificationsAction } from './notifications';
import { RatesAction } from './rates';
import { SwapAction } from './swap';
import { TransactionAction } from './transaction';
import { WalletAction } from './wallet';
export type AllActions =
  | ConfigAction
  | CustomTokenAction
  | DeterministicWalletAction
  | EnsAction
  | NotificationsAction
  | RatesAction
  | SwapAction
  | TransactionAction
  | WalletAction;
