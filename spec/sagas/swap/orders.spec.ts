import { showNotification } from 'actions/notifications';
import {
  bityOrderCreateFailedSwap,
  bityOrderCreateSucceededSwap,
  bityOrderCreateRequestedSwap,
  BityOrderPostResponse,
  BityOrderInput,
  BityOrderOutput,
  BityOrderResponse,
  changeStepSwap,
  orderStatusRequestedSwap,
  orderStatusSucceededSwap,
  orderTimeSwap,
  startOrderTimerSwap,
  startPollBityOrderStatus,
  stopLoadBityRatesSwap,
  stopPollBityOrderStatus
} from 'actions/swap';
import { getOrderStatus, postOrder } from 'api/bity';
import {
  State as SwapState,
  INITIAL_STATE as INITIAL_SWAP_STATE
} from 'reducers/swap';
import { delay } from 'redux-saga';
import {
  call,
  cancel,
  cancelled,
  fork,
  put,
  select,
  take,
  takeEvery
} from 'redux-saga/effects';
import {
  getSwap,
  pollBityOrderStatus,
  pollBityOrderStatusSaga,
  postBityOrderCreate,
  postBityOrderSaga,
  bityTimeRemaining,
  BITY_TIMEOUT_MESSAGE
} from 'sagas/swap/orders';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';

const ONE_SECOND = 1000;
const TEN_SECONDS = ONE_SECOND * 10;
const ELEVEN_SECONDS = ONE_SECOND * 11;

const orderInput: BityOrderInput = {
  amount: 'amount',
  currency: 'currency',
  reference: 'reference',
  status: 'status'
};
const orderOutput: BityOrderOutput = {
  amount: 'amount',
  currency: 'currency',
  reference: 'reference',
  status: 'status'
};

describe('pollBityOrderStatus*', () => {
  const data = {} as any;
  data.gen = cloneableGenerator(pollBityOrderStatus)();
  const fakeSwap: SwapState = {
    ...INITIAL_SWAP_STATE,
    orderId: '1'
  };
  const orderResponse: BityOrderResponse = {
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
  let random;

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should select getSwap', () => {
    expect(data.gen.next().value).toEqual(select(getSwap));
  });

  it('should put orderStatusRequestedSwap', () => {
    expect(data.gen.next(fakeSwap).value).toEqual(
      put(orderStatusRequestedSwap())
    );
  });

  it('should call getOrderStatus with swap.orderId', () => {
    expect(data.gen.next().value).toEqual(
      call(getOrderStatus, fakeSwap.orderId)
    );
  });

  it('should put showNotfication on error', () => {
    data.clone = data.gen.clone();
    expect(data.clone.next(errorStatus).value).toEqual(
      put(
        showNotification(
          'danger',
          `Bity Error: ${errorStatus.msg}`,
          TEN_SECONDS
        )
      )
    );
  });

  it('should put orderStatusSucceededSwap', () => {
    expect(data.gen.next(successStatus).value).toEqual(
      put(orderStatusSucceededSwap(successStatus.data))
    );
  });

  it('should call delay for 5 seconds', () => {
    expect(data.gen.next().value).toEqual(call(delay, ONE_SECOND * 5));
  });

  it('should select getSwap', () => {
    expect(data.gen.next().value).toEqual(select(getSwap));
  });

  it('should break loop if swap is cancelled', () => {
    data.clone2 = data.gen.clone();
    expect(data.clone2.next(cancelledSwap).value).toEqual(cancelled());
    expect(data.clone2.next().done).toEqual(true);
  });

  it('should restart loop', () => {
    expect(data.gen.next(fakeSwap).value).toEqual(
      put(orderStatusRequestedSwap())
    );
  });
});

describe('pollBityOrderStatusSaga*', () => {
  const data = {} as any;
  data.gen = cloneableGenerator(pollBityOrderStatusSaga)();
  const mockedTask = createMockTask();

  it('should take SWAP_START_POLL_BITY_ORDER_STATUS', () => {
    expect(data.gen.next().value).toEqual(
      take('SWAP_START_POLL_BITY_ORDER_STATUS')
    );
  });

  it('should be done if order status is false', () => {
    data.clone = data.gen.clone();
    expect(data.clone.next(false).done).toEqual(true);
  });

  it('should fork pollBityOrderStatus', () => {
    expect(data.gen.next(true).value).toEqual(fork(pollBityOrderStatus));
  });

  it('should take SWAP_STOP_POLL_BITY_ORDER_STATUS', () => {
    expect(data.gen.next(mockedTask).value).toEqual(
      take('SWAP_STOP_POLL_BITY_ORDER_STATUS')
    );
  });

  it('should cancel pollBityOrderStatusTask', () => {
    expect(data.gen.next().value).toEqual(cancel(mockedTask));
  });
});

describe('postBityOrderCreate*', () => {
  const amount = 100;
  const destinationAddress = '0x0';
  const pair = 'BTC_ETH';
  const action = bityOrderCreateRequestedSwap(amount, destinationAddress, pair);
  const orderResp: BityOrderPostResponse = {
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
  data.gen = cloneableGenerator(postBityOrderCreate)(action);

  let random;
  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should put stopLoadBityRatesSwap', () => {
    expect(data.gen.next().value).toEqual(put(stopLoadBityRatesSwap()));
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
      put(bityOrderCreateSucceededSwap(successOrder.data))
    );
  });

  it('should put changeStepSwap', () => {
    expect(data.gen.next().value).toEqual(put(changeStepSwap(3)));
  });

  it('should put startOrderTimerSwap', () => {
    expect(data.gen.next().value).toEqual(put(startOrderTimerSwap()));
  });

  it('should put startPollBityOrderStatus', () => {
    expect(data.gen.next().value).toEqual(put(startPollBityOrderStatus()));
  });

  // failure modes
  it('should handle a connection exeception', () => {
    expect(data.clone1.throw().value).toEqual(
      put(showNotification('danger', connectionErrMsg, TEN_SECONDS))
    );
    expect(data.clone1.next().value).toEqual(put(bityOrderCreateFailedSwap()));
    expect(data.clone1.next().done).toEqual(true);
  });

  it('should handle an errored order', () => {
    expect(data.clone2.next(errorOrder).value).toEqual(
      put(
        showNotification('danger', `Bity Error: ${errorOrder.msg}`, TEN_SECONDS)
      )
    );
    expect(data.clone2.next().value).toEqual(put(bityOrderCreateFailedSwap()));
  });
});

describe('postBityOrderSaga*', () => {
  const gen = postBityOrderSaga();

  it('should takeEvery SWAP_ORDER_CREATE_REQUESTED', () => {
    expect(gen.next().value).toEqual(
      takeEvery('SWAP_ORDER_CREATE_REQUESTED', postBityOrderCreate)
    );
  });
});

describe('bityTimeRemaining*', () => {
  const orderTime = new Date().toISOString();
  const orderTimeExpired = new Date().getTime() - ELEVEN_SECONDS;
  const swapValidFor = 10; //seconds
  const swapOrder = {
    ...INITIAL_SWAP_STATE,
    orderTimestampCreatedISOString: orderTime,
    validFor: swapValidFor
  };
  const swapOrderExpired = {
    ...INITIAL_SWAP_STATE,
    orderTimestampCreatedISOString: new Date(orderTimeExpired).toISOString(),
    validFor: swapValidFor
  };
  let random;

  const data = {} as any;
  data.gen = cloneableGenerator(bityTimeRemaining)();

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should take SWAP_ORDER_START_TIMER', () => {
    expect(data.gen.next().value).toEqual(take('SWAP_ORDER_START_TIMER'));
  });

  it('should break while loop when take SWAP_ORDER_START_TIMER is false', () => {
    data.clone1 = data.gen.clone();
    expect(data.clone1.next().done).toEqual(true);
  });

  it('should call delay of one second', () => {
    expect(data.gen.next(true).value).toEqual(call(delay, ONE_SECOND));
  });

  it('should select getSwap', () => {
    expect(data.gen.next().value).toEqual(select(getSwap));
  });

  it('should handle if isValidUntil.isAfter(now)', () => {
    data.clone2 = data.gen.clone();
    const result = data.clone2.next(swapOrder).value;
    expect(result).toHaveProperty('PUT');
    expect(result.PUT.action.type).toEqual('SWAP_ORDER_TIME');
    expect(result.PUT.action.payload).toBeGreaterThan(0);
  });

  it('should handle an OPEN order state', () => {
    const openOrder = { ...swapOrderExpired, orderStatus: 'OPEN' };
    data.OPEN = data.gen.clone();
    expect(data.OPEN.next(openOrder).value).toEqual(put(orderTimeSwap(0)));
    expect(data.OPEN.next().value).toEqual(put(stopPollBityOrderStatus()));
    expect(data.OPEN.next().value).toEqual(
      put({ type: 'SWAP_STOP_LOAD_BITY_RATES' })
    );
    expect(data.OPEN.next().value).toEqual(
      put(showNotification('danger', BITY_TIMEOUT_MESSAGE, Infinity))
    );
  });

  it('should handle a CANC order state', () => {
    const cancOrder = { ...swapOrderExpired, orderStatus: 'CANC' };
    data.CANC = data.gen.clone();
    expect(data.CANC.next(cancOrder).value).toEqual(
      put(stopPollBityOrderStatus())
    );
    expect(data.CANC.next().value).toEqual(
      put({ type: 'SWAP_STOP_LOAD_BITY_RATES' })
    );
    expect(data.CANC.next().value).toEqual(
      put(showNotification('danger', BITY_TIMEOUT_MESSAGE, Infinity))
    );
  });

  it('should handle a RCVE order state', () => {
    const rcveOrder = { ...swapOrderExpired, orderStatus: 'RCVE' };
    data.RCVE = data.gen.clone();
    expect(data.RCVE.next(rcveOrder).value).toEqual(
      put(showNotification('warning', BITY_TIMEOUT_MESSAGE, Infinity))
    );
  });

  it('should handle a FILL order state', () => {
    const fillOrder = { ...swapOrderExpired, orderStatus: 'FILL' };
    data.FILL = data.gen.clone();
    expect(data.FILL.next(fillOrder).value).toEqual(
      put(stopPollBityOrderStatus())
    );
    expect(data.FILL.next().value).toEqual(
      put({ type: 'SWAP_STOP_LOAD_BITY_RATES' })
    );
  });
});
