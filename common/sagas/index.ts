import handleConfigChanges from './config';
import contracts from './contracts';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import rates from './rates';
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
  contracts,
  notifications,
  rates,
  wallet,
  deterministicWallets
};
