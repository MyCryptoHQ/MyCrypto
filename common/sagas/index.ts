import configSaga from './config';
import contracts from './contracts';
import deterministicWallets from './deterministicWallets';
import notifications from './notifications';
import {
  bityTimeRemaining,
  pollBityOrderStatusSaga,
  postBityOrderSaga
} from './swap/orders';
import { getBityRatesSaga } from './swap/rates';
import wallet from './wallet';
import ens from './ens';
export default {
  ens,
  bityTimeRemaining,
  configSaga,
  postBityOrderSaga,
  pollBityOrderStatusSaga,
  getBityRatesSaga,
  contracts,
  notifications,
  wallet,
  deterministicWallets
};
