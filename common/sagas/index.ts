import configSaga from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import {
  swapTimerSaga,
  pollBityOrderStatusSaga,
  postBityOrderSaga,
  postShapeshiftOrderSaga,
  pollShapeshiftOrderStatusSaga,
  restartSwapSaga
} from './swap/orders';
import { getBityRatesSaga, getShapeShiftRatesSaga, swapProviderSaga } from './swap/rates';
import wallet from './wallet';
import { transaction } from './transaction';

export default {
  configSaga,
  postBityOrderSaga,
  postShapeshiftOrderSaga,
  pollBityOrderStatusSaga,
  pollShapeshiftOrderStatusSaga,
  getBityRatesSaga,
  getShapeShiftRatesSaga,
  swapTimerSaga,
  restartSwapSaga,
  notifications,
  wallet,
  transaction,
  deterministicWallets,
  swapProviderSaga
};
