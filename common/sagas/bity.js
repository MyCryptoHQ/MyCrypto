// @flow
import { showNotification } from 'actions/notifications';
import { delay } from 'redux-saga';
import { postOrder } from 'api/bity';
import {
  call,
  put,
  fork,
  take,
  cancel,
  select,
  cancelled,
  takeEvery,
  Effect
} from 'redux-saga/effects';
import {
  orderTimeTickSwap,
  orderCreateSucceededSwap,
  stopLoadBityRatesSwap,
  changeStepSwap,
  getOrderStatus
} from 'actions/swap';

export const getSwap = state => state.swap;
const ONE_SECOND = 1000;
const TEN_SECONDS = ONE_SECOND * 10;
const BITY_TIMEOUT_MESSAGE = `
    Time has run out. 
    If you have already sent, please wait 1 hour. 
    If your order has not be processed after 1 hour, 
    please press the orange 'Issue with your Swap?' button.
`;

export function* bityTimeRemaining() {
  while (yield take('SWAP_ORDER_START_TIMER')) {
    while (true) {
      yield call(delay, ONE_SECOND);
      const swap = yield select(getSwap);
      if (swap.bityOrder.status === 'OPEN') {
        if (swap.secondsRemaining > 0) {
          yield put(orderTimeTickSwap());
        } else {
          yield put(showNotification('danger', BITY_TIMEOUT_MESSAGE, 0)); // 0 is forever
          break;
        }
      } else {
        // stop dispatching time tick
        break;
      }
    }
  }
}

// let myFirstPromise = new Promise((resolve, reject) => {
//   setTimeout(function() {
//     resolve({
//       error: false,
//       msg: '',
//       data: {
//         id:
//           '826c9803a20e97a1d2b6362bfbaa487e3d69f5240d9c97c597b8d03041a8385d9404a3c74cba74c8c046347d4916f64eWpm51ZOYaguoa0nbnZti6w==',
//         amount: '1',
//         amount_mode: 0,
//         pair: 'ETHBTC',
//         payment_address: '0x60d9fb9e284947c8cb2e415109886390be796f1d',
//         payment_amount: '1',
//         reference: 'BITYVPNOIP',
//         status: 'OPEN',
//         validFor: 600,
//         timestamp_created: '2017-07-23T17:44:06.505520Z',
//         input: {
//           amount: '1.00000000',
//           currency: 'ETH',
//           reference: 'BITYVPNOIP',
//           status: 'OPEN'
//         },
//         output: {
//           amount: '0.08074200',
//           currency: 'BTC',
//           reference: '',
//           status: 'OPEN'
//         }
//       }
//     });
//   }, 250);
// });
