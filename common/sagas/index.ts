import { ensSaga as ens } from 'redux/ens/sagas';
import { configSaga } from 'redux/config/sagas';
import {
  swapOrdersSaga as swapOrders,
  swapRatesSaga as swapRates,
  swapLiteSendSaga as swapLiteSend
} from 'redux/swap/sagas';
import { notificationsSaga as notifications } from 'redux/notifications/sagas';
import { walletSaga as wallet } from 'redux/wallet/sagas';
import { messageSaga as message } from 'redux/message/sagas';
import { deterministicWalletsSaga as deterministicWallets } from 'redux/deterministicWallets/sagas';
import { ratesSaga as rates } from 'redux/rates/sagas';
import { transactionsSaga as transactions } from 'redux/transactions/sagas';
import { gasSaga as gas } from 'redux/gas/sagas';
import { scheduleSaga as schedule } from 'redux/schedule/sagas';
import { addressBookSaga as addressBook } from 'redux/addressBook/sagas';
import { transactionSaga as transaction } from 'redux/transaction';

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
