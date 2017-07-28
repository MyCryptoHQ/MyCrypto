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

export default {
  bityTimeRemaining,
  postBityOrderSaga,
  pollBityOrderStatusSaga,
  getBityRatesSaga,
  contracts,
  ens,
  notifications,
  rates,
  wallet
};
