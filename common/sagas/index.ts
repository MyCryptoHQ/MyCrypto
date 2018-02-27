import configSaga from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import rates from './rates';
import swapOrders from './swap/orders';
import swapLiteSend from './swap/liteSend';
import swapRates from './swap/rates';
import wallet from './wallet';
import { ens } from './ens';
import { transaction } from './transaction';
import transactions from './transactions';
import gas from './gas';

export default {
  ens,
  configSaga,
  swapOrders,
  swapRates,
  swapLiteSend,
  notifications,
  wallet,
  transaction,
  deterministicWallets,
  rates,
  transactions,
  gas
};
