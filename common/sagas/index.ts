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
import { message } from './message';
import transactions from './transactions';
import gas from './gas';
import { schedule } from './schedule';
import addressBook from './addressBook';

export default {
  ens,
  configSaga,
  swapOrders,
  swapRates,
  swapLiteSend,
  notifications,
  wallet,
  transaction,
  message,
  deterministicWallets,
  rates,
  transactions,
  gas,
  schedule,
  addressBook
};
