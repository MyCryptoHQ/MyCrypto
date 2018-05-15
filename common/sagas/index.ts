import { transaction } from './transaction';

import { ensSaga as ens } from 'redux/ens';
import { configSaga } from 'redux/config';
import {
  swapOrdersSaga as swapOrders,
  swapRatesSaga as swapRates,
  swapLiteSendSaga as swapLiteSend
} from 'redux/swap';
import { notificationsSaga as notifications } from 'redux/notifications';
import { walletSaga as wallet } from 'redux/wallet';
import { messageSaga as message } from 'redux/message';
import { deterministicWalletsSaga as deterministicWallets } from 'redux/deterministicWallets';
import { ratesSaga as rates } from 'redux/rates';
import { transactionsSaga as transactions } from 'redux/transactions';
import { gasSaga as gas } from 'redux/gas';
import { scheduleSaga as schedule } from 'redux/schedule';
import { addressBookSaga as addressBook } from 'redux/addressBook';

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
