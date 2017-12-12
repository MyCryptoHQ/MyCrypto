import configSaga from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import {
  orderTimeRemaining,
  pollBityOrderStatusSaga,
  postBityOrderSaga,
  postShapeshiftOrderSaga,
  pollShapeshiftOrderStatusSaga
} from './swap/orders';
import { getBityRatesSaga, getShapeShiftRatesSaga } from './swap/rates';
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
  notifications,
  wallet,
  deterministicWallets
};
