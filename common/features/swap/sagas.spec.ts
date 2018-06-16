import { delay } from 'redux-saga';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { take, race, fork, call, cancel, apply, cancelled, put, select } from 'redux-saga/effects';

import { getAllRates, getOrderStatus, postOrder } from 'api/bity';
import shapeshift from 'api/shapeshift';
import configuredStore from 'features/store';
import * as transactionTypes from 'features/transaction/types';
import * as walletTypes from 'features/wallet/types';
import * as notificationsActions from 'features/notifications/actions';
import * as swapTypes from './types';
import * as swapActions from './actions';
import * as swapReducer from './reducer';
import * as swapSelectors from './selectors';
import * as swapSagas from './sagas';

configuredStore.getState();

//#region Lite Send
describe('swap: Sagas (Lite Send)', () => {
  describe('Testing handle configure lite send', () => {
    const generators = {
      original: cloneableGenerator(swapSagas.handleConfigureLiteSend)()
    };
    const { original } = generators;

    it('forks a configureLiteSend saga', () => {
      const expectedYield = fork(swapSagas.configureLiteSendSaga);
      expect(original.next().value).toEqual(expectedYield);
    });

    it('races between three conditions, either the transaction state is reset, the user navigated away from the page, or bitty/shapeshift polling as finished', () => {
      const mockedTask = createMockTask();
      const expectedYield = race({
        transactionReset: take(transactionTypes.TRANSACTION.RESET_REQUESTED),
        userNavigatedAway: take(walletTypes.WalletActions.RESET),
        bityPollingFinished: take(swapTypes.SwapActions.STOP_POLL_BITY_ORDER_STATUS),
        shapeshiftPollingFinished: take(swapTypes.SwapActions.STOP_POLL_SHAPESHIFT_ORDER_STATUS)
      });

      expect(original.next(mockedTask).value).toEqual(expectedYield);
    });
  });
});
//#endregion Lite Send

//#region Orders
describe('swap: Sagas (Orders)', () => {
  const ONE_SECOND = 1000;
  const TEN_SECONDS = ONE_SECOND * 10;
  const ELEVEN_SECONDS = ONE_SECOND * 11;

  const orderInput: swapTypes.BityOrderInput = {
    amount: 'amount',
    currency: 'currency',
    reference: 'reference',
    status: 'status'
  };
  const orderOutput: swapTypes.BityOrderOutput = {
    amount: 'amount',
    currency: 'currency',
    reference: 'reference',
    status: 'status'
  };

  describe('pollBityOrderStatus*', () => {
    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.pollBityOrderStatus)();
    const fakeSwap: swapTypes.SwapState = {
      ...swapReducer.INITIAL_STATE,
      orderId: '1'
    };
    const orderResponse: swapTypes.BityOrderResponse = {
      input: orderInput,
      output: orderOutput,
      status: 'status'
    };
    const cancelledSwap = 'CANC';
    const successStatus = {
      error: null,
      data: orderResponse
    };
    const errorStatus = {
      error: true,
      msg: 'error message'
    };
    let random: () => number;

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should select swapSelectors.getSwap', () => {
      expect(data.gen.next().value).toEqual(select(swapSelectors.getSwap));
    });

    it('should put bityOrderStatusRequestedSwap', () => {
      expect(data.gen.next(fakeSwap).value).toEqual(put(swapActions.bityOrderStatusRequested()));
    });

    it('should call getOrderStatus with swap.orderId', () => {
      expect(data.gen.next().value).toEqual(call(getOrderStatus, fakeSwap.orderId));
    });

    it('should put showNotfication on error', () => {
      data.clone = data.gen.clone();
      expect(data.clone.next(errorStatus).value).toEqual(
        put(
          notificationsActions.showNotification(
            'danger',
            `Bity Error: ${errorStatus.msg}`,
            TEN_SECONDS
          )
        )
      );
    });

    it('should put orderStatusSucceededSwap', () => {
      expect(data.gen.next(successStatus).value).toEqual(
        put(swapActions.bityOrderStatusSucceededSwap(successStatus.data))
      );
    });

    it('should call delay for 5 seconds', () => {
      expect(data.gen.next().value).toEqual(call(delay, ONE_SECOND * 5));
    });

    it('should select swapSelectors.getSwap', () => {
      expect(data.gen.next().value).toEqual(select(swapSelectors.getSwap));
    });

    it('should break loop if swap is cancelled', () => {
      data.clone2 = data.gen.clone();
      expect(data.clone2.next(cancelledSwap).value).toEqual(cancelled());
      expect(data.clone2.next().done).toEqual(true);
    });

    it('should restart loop', () => {
      expect(data.gen.next(fakeSwap).value).toEqual(put(swapActions.bityOrderStatusRequested()));
    });
  });

  describe('pollShapeshiftOrderStatus*', () => {
    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.pollShapeshiftOrderStatus)();
    const fakeSwap: swapTypes.SwapState = {
      ...swapReducer.INITIAL_STATE,
      orderId: '1'
    };
    const cancelledSwap = 'CANC';
    const successStatus = {
      status: 'complete',
      transaction: '0x'
    };
    const errorStatus = {
      error: 'Shapeshift error',
      status: 'failed'
    };
    let random: () => number;

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should select swapSelectors.getSwap', () => {
      expect(data.gen.next().value).toEqual(select(swapSelectors.getSwap));
    });

    it('should put shapeshiftOrderStatusRequestedSwap', () => {
      expect(data.gen.next(fakeSwap).value).toEqual(
        put(swapActions.shapeshiftOrderStatusRequested())
      );
    });

    it('should apply shapeshift.checkStatus with swap.paymentAddress', () => {
      expect(data.gen.next().value).toEqual(
        apply(shapeshift, shapeshift.checkStatus, [fakeSwap.paymentAddress])
      );
    });

    it('should put showNotfication on error', () => {
      data.clone = data.gen.clone();
      expect(data.clone.next(errorStatus).value).toEqual(
        put(
          notificationsActions.showNotification(
            'danger',
            `Shapeshift Error: ${errorStatus.error}`,
            Infinity
          )
        )
      );
    });

    it('should put shapeshiftOrderStatusSucceededSwap', () => {
      expect(data.gen.next(successStatus).value).toEqual(
        put(swapActions.shapeshiftOrderStatusSucceededSwap(successStatus))
      );
    });

    it('should call delay for 5 seconds', () => {
      expect(data.gen.next().value).toEqual(call(delay, ONE_SECOND * 5));
    });

    it('should select swapSelectors.getSwap', () => {
      expect(data.gen.next().value).toEqual(select(swapSelectors.getSwap));
    });

    it('should break loop if swap is cancelled', () => {
      data.clone2 = data.gen.clone();
      expect(data.clone2.next(cancelledSwap).value).toEqual(cancelled());
      expect(data.clone2.next().done).toEqual(true);
    });

    it('should restart loop', () => {
      expect(data.gen.next(fakeSwap).value).toEqual(
        put(swapActions.shapeshiftOrderStatusRequested())
      );
    });
  });

  describe('pollBityOrderStatusSaga*', () => {
    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.pollBityOrderStatusSaga)();
    const mockedTask = createMockTask();

    it('should take SWAP_START_POLL_BITY_ORDER_STATUS', () => {
      expect(data.gen.next().value).toEqual(
        take(swapTypes.SwapActions.START_POLL_BITY_ORDER_STATUS)
      );
    });

    it('should be done if order status is false', () => {
      data.clone = data.gen.clone();
      expect(data.clone.next(false).done).toEqual(true);
    });

    it('should fork pollBityOrderStatus', () => {
      expect(data.gen.next(true).value).toEqual(fork(swapSagas.pollBityOrderStatus));
    });

    it('should take SWAP_STOP_POLL_BITY_ORDER_STATUS', () => {
      expect(data.gen.next(mockedTask).value).toEqual(
        take(swapTypes.SwapActions.STOP_POLL_BITY_ORDER_STATUS)
      );
    });

    it('should cancel pollBityOrderStatusTask', () => {
      expect(data.gen.next().value).toEqual(cancel(mockedTask));
    });
  });

  describe('pollShapeshiftOrderStatusSaga*', () => {
    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.pollShapeshiftOrderStatusSaga)();
    const mockedTask = createMockTask();

    it('should take SWAP_START_POLL_SHAPESHIFT_ORDER_STATUS', () => {
      expect(data.gen.next().value).toEqual(
        take(swapTypes.SwapActions.START_POLL_SHAPESHIFT_ORDER_STATUS)
      );
    });

    it('should be done if order status is false', () => {
      data.clone = data.gen.clone();
      expect(data.clone.next(false).done).toEqual(true);
    });

    it('should fork pollShapeshiftOrderStatus', () => {
      expect(data.gen.next(true).value).toEqual(fork(swapSagas.pollShapeshiftOrderStatus));
    });

    it('should take SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS', () => {
      expect(data.gen.next(mockedTask).value).toEqual(
        take(swapTypes.SwapActions.STOP_POLL_SHAPESHIFT_ORDER_STATUS)
      );
    });

    it('should cancel pollShapeshiftOrderStatusTask', () => {
      expect(data.gen.next().value).toEqual(cancel(mockedTask));
    });
  });

  describe('postBityOrderCreate*', () => {
    const amount = 100;
    const destinationAddress = '0x0';
    const pair = 'BTC_ETH';
    const action = swapActions.bityOrderCreateRequestedSwap(amount, destinationAddress, pair);
    const orderResp: swapTypes.BityOrderPostResponse = {
      payment_address: '0x0',
      status: 'status',
      input: orderInput,
      output: orderOutput,
      timestamp_created: 'timestamp_created',
      validFor: 10,
      id: '0'
    };
    const successOrder = { error: false, data: orderResp };
    const errorOrder = { error: true, msg: 'error msg' };
    const connectionErrMsg =
      'Connection Error. Please check the developer console for more details and/or contact support';

    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.postBityOrderCreate)(action);

    let random: () => number;
    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should put stopLoadBityRatesSwap', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.stopLoadBityRatesSwap()));
    });

    it('should call postOrder', () => {
      data.clone1 = data.gen.clone();
      expect(data.gen.next().value).toEqual(
        call(postOrder, amount, destinationAddress, action.payload.mode, pair)
      );
    });

    it('should put bityOrderCreateSucceededSwap', () => {
      data.clone2 = data.gen.clone();
      expect(data.gen.next(successOrder).value).toEqual(
        put(swapActions.bityOrderCreateSucceededSwap(successOrder.data))
      );
    });

    it('should put changeStepSwap', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.changeStepSwap(3)));
    });

    it('should put startOrderTimerSwap', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.startOrderTimerSwap()));
    });

    it('should put startPollBityOrderStatus', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.startPollBityOrderStatus()));
    });

    // failure modes
    it('should handle a connection exeception', () => {
      expect(data.clone1.throw().value).toEqual(
        put(notificationsActions.showNotification('danger', connectionErrMsg, TEN_SECONDS))
      );
      expect(data.clone1.next().value).toEqual(put(swapActions.bityOrderCreateFailedSwap()));
      expect(data.clone1.next().done).toEqual(true);
    });

    it('should handle an errored order', () => {
      expect(data.clone2.next(errorOrder).value).toEqual(
        put(
          notificationsActions.showNotification(
            'danger',
            `Bity Error: ${errorOrder.msg}`,
            TEN_SECONDS
          )
        )
      );
      expect(data.clone2.next().value).toEqual(put(swapActions.bityOrderCreateFailedSwap()));
    });
  });

  describe('postShapeshiftOrderCreate*', () => {
    const amount = 100;
    const withdrawalAddress = '0x0';
    const originKind = 'BAT';
    const destKind = 'ETH';
    const action = swapActions.shapeshiftOrderCreateRequestedSwap(
      withdrawalAddress,
      originKind,
      destKind,
      amount
    );
    const orderResp: swapTypes.ShapeshiftOrderResponse = {
      deposit: '0x0',
      depositAmount: '0',
      expiration: 100,
      maxLimit: 1,
      minerFee: '0.1',
      orderId: '1',
      pair: 'BTC_ETH',
      quotedRate: '1',
      withdrawal: '0x0',
      withdrawalAmount: '2'
    };
    const successOrder = { success: orderResp };
    const errorOrder = { error: 'message' };
    const connectionErrMsg =
      'Connection Error. Please check the developer console for more details and/or contact support';

    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.postShapeshiftOrderCreate)(action);

    let random: () => number;
    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should put stopLoadShapeshiftRatesSwap', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.stopLoadShapeshiftRatesSwap()));
    });

    it('should call shapeshift.sendAmount', () => {
      data.clone1 = data.gen.clone();
      expect(data.gen.next().value).toEqual(
        apply(shapeshift, shapeshift.sendAmount, [
          action.payload.withdrawal,
          action.payload.originKind,
          action.payload.destinationKind,
          action.payload.destinationAmount
        ])
      );
    });

    it('should put shapeshiftOrderCreateSucceededSwap', () => {
      data.clone2 = data.gen.clone();
      expect(data.gen.next(successOrder).value).toEqual(
        put(swapActions.shapeshiftOrderCreateSucceededSwap(successOrder.success))
      );
    });

    it('should put changeStepSwap', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.changeStepSwap(3)));
    });

    it('should put startOrderTimerSwap', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.startOrderTimerSwap()));
    });

    it('should put startPollShapeshiftOrderStatus', () => {
      expect(data.gen.next().value).toEqual(put(swapActions.startPollShapeshiftOrderStatus()));
    });

    // failure modes
    it('should handle a connection exeception', () => {
      expect(data.clone1.throw().value).toEqual(
        put(notificationsActions.showNotification('danger', connectionErrMsg, TEN_SECONDS))
      );
      expect(data.clone1.next().value).toEqual(put(swapActions.shapeshiftOrderCreateFailedSwap()));
      expect(data.clone1.next().done).toEqual(true);
    });

    it('should handle an errored order', () => {
      expect(data.clone2.next(errorOrder).value).toEqual(
        put(
          notificationsActions.showNotification(
            'danger',
            `Shapeshift Error: ${errorOrder.error}`,
            TEN_SECONDS
          )
        )
      );
      expect(data.clone2.next().value).toEqual(put(swapActions.shapeshiftOrderCreateFailedSwap()));
    });
  });

  describe('bityOrderTimeRemaining*', () => {
    const orderTime = new Date().toISOString();
    const orderTimeExpired = new Date().getTime() - ELEVEN_SECONDS;
    const swapValidFor = 10; //seconds
    const swapOrder = {
      ...swapReducer.INITIAL_STATE,
      orderTimestampCreatedISOString: orderTime,
      validFor: swapValidFor
    };
    const swapOrderExpired = {
      ...swapReducer.INITIAL_STATE,
      orderTimestampCreatedISOString: new Date(orderTimeExpired).toISOString(),
      validFor: swapValidFor
    };
    let random: () => number;

    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.bityOrderTimeRemaining)();

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should call delay of one second', () => {
      expect(data.gen.next(true).value).toEqual(call(delay, ONE_SECOND));
    });

    it('should select swapSelectors.getSwap', () => {
      expect(data.gen.next().value).toEqual(select(swapSelectors.getSwap));
    });

    it('should handle if isValidUntil.isAfter(now)', () => {
      data.clone2 = data.gen.clone();
      const result = data.clone2.next(swapOrder).value;
      expect(result).toHaveProperty('PUT');
      expect(result.PUT.action.type).toEqual('SWAP_ORDER_TIME');
      expect(result.PUT.action.payload).toBeGreaterThan(0);
    });

    it('should handle an OPEN order state', () => {
      const openOrder = { ...swapOrderExpired, bityOrderStatus: 'OPEN' };
      data.OPEN = data.gen.clone();
      expect(data.OPEN.next(openOrder).value).toEqual(put(swapActions.orderTimeSwap(0)));
      expect(data.OPEN.next().value).toEqual(put(swapActions.stopPollBityOrderStatus()));
      expect(data.OPEN.next().value).toEqual(
        put({ type: swapTypes.SwapActions.STOP_LOAD_BITY_RATES })
      );
      expect(data.OPEN.next().value).toEqual(
        put(
          notificationsActions.showNotification('danger', swapSagas.ORDER_TIMEOUT_MESSAGE, Infinity)
        )
      );
    });

    it('should handle a CANC order state', () => {
      const cancOrder = { ...swapOrderExpired, bityOrderStatus: 'CANC' };
      data.CANC = data.gen.clone();
      expect(data.CANC.next(cancOrder).value).toEqual(put(swapActions.stopPollBityOrderStatus()));
      expect(data.CANC.next().value).toEqual(
        put({ type: swapTypes.SwapActions.STOP_LOAD_BITY_RATES })
      );
      expect(data.CANC.next().value).toEqual(
        put(
          notificationsActions.showNotification('danger', swapSagas.ORDER_TIMEOUT_MESSAGE, Infinity)
        )
      );
    });

    it('should handle a RCVE order state', () => {
      const rcveOrder = { ...swapOrderExpired, bityOrderStatus: 'RCVE' };
      data.RCVE = data.gen.clone();
      expect(data.RCVE.next(rcveOrder).value).toEqual(
        put(
          notificationsActions.showNotification(
            'warning',
            swapSagas.ORDER_TIMEOUT_MESSAGE,
            Infinity
          )
        )
      );
    });

    it('should handle a FILL order state', () => {
      const fillOrder = { ...swapOrderExpired, bityOrderStatus: 'FILL' };
      data.FILL = data.gen.clone();
      expect(data.FILL.next(fillOrder).value).toEqual(put(swapActions.stopPollBityOrderStatus()));
      expect(data.FILL.next().value).toEqual(
        put({ type: swapTypes.SwapActions.STOP_LOAD_BITY_RATES })
      );
    });
  });

  describe('shapeshiftOrderTimeRemaining*', () => {
    const orderTime = new Date().toISOString();
    const orderTimeExpired = new Date().getTime() - ELEVEN_SECONDS;
    const swapValidFor = 10; //seconds
    const swapOrder = {
      ...swapReducer.INITIAL_STATE,
      orderTimestampCreatedISOString: orderTime,
      validFor: swapValidFor
    };
    const swapOrderExpired = {
      ...swapReducer.INITIAL_STATE,
      orderTimestampCreatedISOString: new Date(orderTimeExpired).toISOString(),
      validFor: swapValidFor
    };
    let random: () => number;

    const data = {} as any;
    data.gen = cloneableGenerator(swapSagas.shapeshiftOrderTimeRemaining)();

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should call delay of one second', () => {
      expect(data.gen.next(true).value).toEqual(call(delay, ONE_SECOND));
    });

    it('should select swapSelectors.getSwap', () => {
      expect(data.gen.next().value).toEqual(select(swapSelectors.getSwap));
    });

    it('should handle if isValidUntil.isAfter(now)', () => {
      data.clone2 = data.gen.clone();
      const result = data.clone2.next(swapOrder).value;
      expect(result).toHaveProperty('PUT');
      expect(result.PUT.action.type).toEqual('SWAP_ORDER_TIME');
      expect(result.PUT.action.payload).toBeGreaterThan(0);
    });

    it('should handle an no_deposits order state', () => {
      const openOrder = { ...swapOrderExpired, shapeshiftOrderStatus: 'no_deposits' };
      data.OPEN = data.gen.clone();
      expect(data.OPEN.next(openOrder).value).toEqual(put(swapActions.orderTimeSwap(0)));
      expect(data.OPEN.next().value).toEqual(put(swapActions.stopPollShapeshiftOrderStatus()));
      expect(data.OPEN.next().value).toEqual(
        put({ type: swapTypes.SwapActions.STOP_LOAD_SHAPESHIFT_RATES })
      );
      expect(data.OPEN.next().value).toEqual(
        put(
          notificationsActions.showNotification('danger', swapSagas.ORDER_TIMEOUT_MESSAGE, Infinity)
        )
      );
    });

    it('should handle a failed order state', () => {
      const cancOrder = { ...swapOrderExpired, shapeshiftOrderStatus: 'failed' };
      data.CANC = data.gen.clone();
      expect(data.CANC.next(cancOrder).value).toEqual(
        put(swapActions.stopPollShapeshiftOrderStatus())
      );
      expect(data.CANC.next().value).toEqual(
        put({ type: swapTypes.SwapActions.STOP_LOAD_SHAPESHIFT_RATES })
      );
      expect(data.CANC.next().value).toEqual(
        put(
          notificationsActions.showNotification('danger', swapSagas.ORDER_TIMEOUT_MESSAGE, Infinity)
        )
      );
    });

    it('should handle a received order state', () => {
      const rcveOrder = { ...swapOrderExpired, shapeshiftOrderStatus: 'received' };
      data.RCVE = data.gen.clone();
      expect(data.RCVE.next(rcveOrder).value).toEqual(
        put(
          notificationsActions.showNotification(
            'warning',
            swapSagas.ORDER_RECEIVED_MESSAGE,
            Infinity
          )
        )
      );
    });

    it('should handle a complete order state', () => {
      const fillOrder = { ...swapOrderExpired, shapeshiftOrderStatus: 'complete' };
      data.COMPLETE = data.gen.clone();
      expect(data.COMPLETE.next(fillOrder).value).toEqual(
        put(swapActions.stopPollShapeshiftOrderStatus())
      );
      expect(data.COMPLETE.next().value).toEqual(
        put({ type: swapTypes.SwapActions.STOP_LOAD_SHAPESHIFT_RATES })
      );
      expect(data.COMPLETE.next().value).toEqual(put(swapActions.stopOrderTimerSwap()));
    });
  });
});
//#endregion Orders

//#region Rates
describe('swap: Sagas (Rates)', () => {
  describe('loadBityRates*', () => {
    const gen1 = swapSagas.loadBityRates();
    const apiResponse = {
      BTCETH: {
        id: 'BTCETH',
        options: [{ id: 'BTC' }, { id: 'ETH' }],
        rate: 23.27855114
      },
      ETHBTC: {
        id: 'ETHBTC',
        options: [{ id: 'ETH' }, { id: 'BTC' }],
        rate: 0.042958
      }
    };
    const err = { message: 'error' };
    let random: () => number;

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should call getAllRates', () => {
      expect(gen1.next().value).toEqual(call(getAllRates));
    });

    it('should put loadBityRatesSucceededSwap', () => {
      expect(gen1.next(apiResponse).value).toEqual(
        put(swapActions.loadBityRatesSucceededSwap(apiResponse))
      );
    });

    it(`should delay for ${swapSagas.POLLING_CYCLE}ms`, () => {
      expect(gen1.next().value).toEqual(call(delay, swapSagas.POLLING_CYCLE));
    });

    it('should handle an exception', () => {
      const errGen = swapSagas.loadBityRates();
      errGen.next();
      expect((errGen as any).throw(err).value).toEqual(
        select(swapSelectors.getHasNotifiedRatesFailure)
      );
      expect(errGen.next(false).value).toEqual(
        put(notificationsActions.showNotification('danger', err.message))
      );
      expect(errGen.next().value).toEqual(put(swapActions.loadBityRatesFailedSwap()));
      expect(errGen.next().value).toEqual(call(delay, swapSagas.POLLING_CYCLE));
    });

    it('should not notify on subsequent exceptions', () => {
      const noNotifyErrGen = swapSagas.loadBityRates();
      noNotifyErrGen.next();
      expect((noNotifyErrGen as any).throw(err).value).toEqual(
        select(swapSelectors.getHasNotifiedRatesFailure)
      );
      expect(noNotifyErrGen.next(true).value).toEqual(put(swapActions.loadBityRatesFailedSwap()));
      expect(noNotifyErrGen.next().value).toEqual(call(delay, swapSagas.POLLING_CYCLE));
    });
  });

  describe('loadShapeshiftRates*', () => {
    const gen1 = swapSagas.loadShapeshiftRates();

    const apiResponse = {
      ['1SSTANT']: {
        id: '1STANT',
        options: [
          {
            id: '1ST',
            status: 'available',
            image: 'https://shapeshift.io/images/coins/firstblood.png',
            name: 'FirstBlood'
          },
          {
            id: 'ANT',
            status: 'available',
            image: 'https://shapeshift.io/images/coins/aragon.png',
            name: 'Aragon'
          }
        ],
        rate: '0.24707537',
        limit: 5908.29166225,
        min: 7.86382979
      }
    };
    const err = 'error';
    let random: () => number;

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should race shapeshift.getAllRates', () => {
      expect(gen1.next().value).toEqual(
        race({
          tokens: call(shapeshift.getAllRates),
          timeout: call(delay, swapSagas.SHAPESHIFT_TIMEOUT)
        })
      );
    });

    it('should put loadShapeshiftRatesSucceededSwap', () => {
      expect(gen1.next({ tokens: apiResponse }).value).toEqual(
        put(swapActions.loadShapeshiftRatesSucceededSwap(apiResponse as any))
      );
    });

    it(`should delay for ${swapSagas.POLLING_CYCLE}ms`, () => {
      expect(gen1.next().value).toEqual(call(delay, swapSagas.POLLING_CYCLE));
    });

    it('should handle an exception', () => {
      const errGen = swapSagas.loadShapeshiftRates();
      errGen.next();
      expect((errGen as any).throw(err).value).toEqual(
        select(swapSelectors.getHasNotifiedRatesFailure)
      );
      expect(errGen.next(false).value).toEqual(
        put(
          notificationsActions.showNotification(
            'danger',
            'Failed to load swap rates from ShapeShift, please try again later'
          )
        )
      );
      expect(errGen.next().value).toEqual(put(swapActions.loadShapeshiftRatesFailedSwap()));
    });

    it('should not notify on subsequent exceptions', () => {
      const noNotifyErrGen = swapSagas.loadShapeshiftRates();
      noNotifyErrGen.next();
      expect((noNotifyErrGen as any).throw(err).value).toEqual(
        select(swapSelectors.getHasNotifiedRatesFailure)
      );
      expect(noNotifyErrGen.next(true).value).toEqual(
        put(swapActions.loadShapeshiftRatesFailedSwap())
      );
    });
  });

  describe('handleBityRates*', () => {
    const gen = swapSagas.handleBityRates();
    const mockTask = createMockTask();

    it('should fork loadBityRates', () => {
      expect(gen.next().value).toEqual(fork(swapSagas.loadBityRates));
    });

    it('should take SWAP_STOP_LOAD_BITY_RATES', () => {
      expect(gen.next(mockTask).value).toEqual(take(swapTypes.SwapActions.STOP_LOAD_BITY_RATES));
    });

    it('should cancel loadBityRatesTask', () => {
      expect(gen.next().value).toEqual(cancel(mockTask));
    });

    it('should be done', () => {
      expect(gen.next().done).toEqual(true);
    });
  });

  describe('handleShapeshiftRates*', () => {
    const gen = swapSagas.handleShapeshiftRates();
    const mockTask = createMockTask();

    it('should fork loadShapeshiftRates', () => {
      expect(gen.next().value).toEqual(fork(swapSagas.loadShapeshiftRates));
    });

    it('should take SWAP_STOP_LOAD_BITY_RATES', () => {
      expect(gen.next(mockTask).value).toEqual(
        take(swapTypes.SwapActions.STOP_LOAD_SHAPESHIFT_RATES)
      );
    });

    it('should cancel loadShapeShiftRatesTask', () => {
      expect(gen.next().value).toEqual(cancel(mockTask));
    });

    it('should be done', () => {
      expect(gen.next().done).toEqual(true);
    });
  });
});
//#endregion Rates
