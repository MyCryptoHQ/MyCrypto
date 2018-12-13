import { ensSaga as ens } from './ens/sagas';
import { configSaga as config } from './config/sagas';
import { notificationsSaga as notifications } from './notifications/sagas';
import { walletSaga as wallet } from './wallet/sagas';
import { transactionsSaga as transactions } from './transactions/sagas';
import { messageSaga as message } from './message/sagas';
import { deterministicWalletsSaga as deterministicWallets } from './deterministicWallets/sagas';
import { ratesSaga as rates } from './rates/sagas';
import { transactionSaga as transaction } from './transaction/sagas';
import { gasSaga as gas } from './gas/sagas';
import { scheduleSaga as schedule } from './schedule/sagas';
import { addressBookSaga as addressBook } from './addressBook/sagas';

export default {
  ens,
  config,
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
