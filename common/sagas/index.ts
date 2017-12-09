import configSaga from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import { bityTimeRemaining, pollBityOrderStatusSaga, postBityOrderSaga } from './swap/orders';
import { getBityRatesSaga, getShapeShiftRatesSaga } from './swap/rates';
import wallet from './wallet';

export default {
  bityTimeRemaining,
  configSaga,
  postBityOrderSaga,
  pollBityOrderStatusSaga,
  getBityRatesSaga,
  getShapeShiftRatesSaga,
  notifications,
  wallet,
  deterministicWallets
};
