import configSaga from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import { bityTimeRemaining, pollBityOrderStatusSaga, postBityOrderSaga } from './swap/orders';
import { getBityRatesSaga } from './swap/rates';
import wallet from './wallet';
import { ens } from './ens';
import { transaction } from './transaction';
export default {
  ens,
  transaction,
  bityTimeRemaining,
  configSaga,
  postBityOrderSaga,
  pollBityOrderStatusSaga,
  getBityRatesSaga,
  notifications,
  wallet,
  deterministicWallets
};
