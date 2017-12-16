import configSaga from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import {
  orderTimeRemaining,
  pollBityOrderStatusSaga,
  postBityOrderSaga,
  postShapeshiftOrderSaga,
  pollShapeshiftOrderStatusSaga,
  restartSwapSaga
} from './swap/orders';
import { getBityRatesSaga, getShapeShiftRatesSaga, swapProviderSaga } from './swap/rates';
import wallet from './wallet';

export default {
  orderTimeRemaining,
  configSaga,
  postBityOrderSaga,
  postShapeshiftOrderSaga,
  pollBityOrderStatusSaga,
  pollShapeshiftOrderStatusSaga,
  getBityRatesSaga,
  getShapeShiftRatesSaga,
  restartSwapSaga,
  notifications,
  wallet,
  deterministicWallets,
  swapProviderSaga
};
