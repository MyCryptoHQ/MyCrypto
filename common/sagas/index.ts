import handleConfigChanges from './config';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import {
  bityTimeRemaining,
  pollBityOrderStatusSaga,
  postBityOrderSaga
} from './swap/orders';
import { getBityRatesSaga } from './swap/rates';
import wallet from './wallet';

export default {
  bityTimeRemaining,
  handleConfigChanges,
  postBityOrderSaga,
  pollBityOrderStatusSaga,
  getBityRatesSaga,
  notifications,
  wallet,
  deterministicWallets
};
