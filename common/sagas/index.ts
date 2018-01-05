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
import { liteSend } from './swap/liteSend';
import { getBityRatesSaga, getShapeShiftRatesSaga, swapProviderSaga } from './swap/rates';
import wallet from './wallet';
import { transaction } from './transaction';

export default {
  liteSend,
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
