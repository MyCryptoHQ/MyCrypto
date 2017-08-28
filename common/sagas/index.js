import {
  postBityOrderSaga,
  bityTimeRemaining,
  pollBityOrderStatusSaga
} from './swap/orders';
import { getBityRatesSaga } from './swap/rates';
import contracts from './contracts';
import ens from './ens';
import notifications from './notifications';
import rates from './rates';
import wallet from './wallet';
import handleConfigChanges from './config';
import deterministicWallets from './deterministicWallets';


export default {
  bityTimeRemaining,
  handleConfigChanges,
  postBityOrderSaga,
  pollBityOrderStatusSaga,
  getBityRatesSaga,
  contracts,
  ens,
  notifications,
  rates,
  wallet,
  deterministicWallets
};
