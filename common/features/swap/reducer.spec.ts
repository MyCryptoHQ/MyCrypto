import { normalize } from 'normalizr';

import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';
import tokens from 'config/tokens/eth.json';
import * as types from './types';
import * as actions from './actions';
import * as reducer from './reducer';

describe('ensure whitelist', () => {
  const findToken = (tkn: string) => tokens.find((t: any) => t.symbol === tkn);
  SHAPESHIFT_TOKEN_WHITELIST.forEach(t => {
    it(`Should find Token ${t}`, () => {
      expect(findToken(t)).toBeTruthy();
    });
  });
});

describe('swap reducer', () => {
  const shapeshiftApiResponse = {
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

  const bityApiResponse = {
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

  const normalizedBityRates: types.NormalizedBityRates = {
    byId: normalize(bityApiResponse, [reducer.providerRate]).entities.providerRates,
    allIds: reducer.allIds(
      normalize(bityApiResponse, [reducer.providerRate]).entities.providerRates
    )
  };
  const normalizedShapeshiftRates: types.NormalizedShapeshiftRates = {
    byId: normalize(shapeshiftApiResponse, [reducer.providerRate]).entities.providerRates,
    allIds: reducer.allIds(
      normalize(shapeshiftApiResponse, [reducer.providerRate]).entities.providerRates
    )
  };
  const normalizedBityOptions: types.NormalizedOptions = {
    byId: normalize(bityApiResponse, [reducer.providerRate]).entities.options,
    allIds: reducer.allIds(normalize(bityApiResponse, [reducer.providerRate]).entities.options)
  };
  const normalizedShapeshiftOptions: types.NormalizedOptions = {
    byId: normalize(shapeshiftApiResponse, [reducer.providerRate]).entities.options,
    allIds: reducer.allIds(
      normalize(shapeshiftApiResponse, [reducer.providerRate]).entities.options
    )
  };

  it('should handle SWAP_LOAD_BITY_RATES_SUCCEEDED', () => {
    expect(
      reducer.swapReducer(undefined, actions.loadBityRatesSucceededSwap(bityApiResponse))
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isFetchingRates: false,
      bityRates: normalizedBityRates,
      options: normalizedBityOptions
    });
  });

  it('should handle SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED', () => {
    expect(
      reducer.swapReducer(
        undefined,
        actions.loadShapeshiftRatesSucceededSwap(shapeshiftApiResponse as any)
      )
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isFetchingRates: false,
      shapeshiftRates: normalizedShapeshiftRates,
      options: normalizedShapeshiftOptions
    });
  });

  it('should handle SWAP_STEP', () => {
    const step = 2;
    expect(reducer.swapReducer(undefined, actions.changeStepSwap(step))).toEqual({
      ...reducer.INITIAL_STATE,
      step
    });
  });

  it('should handle SWAP_DESTINATION_ADDRESS', () => {
    const destinationAddress = '341a0sdf83';
    expect(
      reducer.swapReducer(undefined, actions.destinationAddressSwap(destinationAddress))
    ).toEqual({
      ...reducer.INITIAL_STATE,
      destinationAddress
    });
  });

  it('should handle SWAP_RESTART', () => {
    expect(
      reducer.swapReducer(
        {
          ...reducer.INITIAL_STATE,
          bityRates: normalizedBityRates,
          shapeshiftRates: normalizedShapeshiftRates,
          origin: { label: 'BTC', amount: 1 },
          destination: { label: 'ETH', amount: 3 }
        },
        actions.restartSwap()
      )
    ).toEqual({
      ...reducer.INITIAL_STATE,
      bityRates: normalizedBityRates,
      shapeshiftRates: normalizedShapeshiftRates
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_REQUESTED', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: types.SwapActions.BITY_ORDER_CREATE_REQUESTED
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: types.SwapActions.BITY_ORDER_CREATE_REQUESTED
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_FAILED', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: types.SwapActions.BITY_ORDER_CREATE_FAILED
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isPostingOrder: false
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_FAILED', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: types.SwapActions.SHAPESHIFT_ORDER_CREATE_FAILED
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isPostingOrder: false
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_SUCCEEDED', () => {
    const mockedBityOrder: types.BityOrderPostResponse = {
      payment_address: 'payment_address',
      status: 'status',
      input: {
        amount: '1.111',
        currency: 'input_currency',
        reference: 'input_reference',
        status: 'input_status'
      },
      output: {
        amount: '1.111',
        currency: 'output_currency',
        reference: 'output_reference',
        status: 'output_status'
      },
      timestamp_created: 'timestamp_created',
      validFor: 0,
      id: 'id'
    };

    expect(
      reducer.swapReducer(undefined, actions.bityOrderCreateSucceededSwap(mockedBityOrder))
    ).toEqual({
      ...reducer.INITIAL_STATE,
      bityOrder: {
        ...mockedBityOrder
      },
      isPostingOrder: false,
      originAmount: parseFloat(mockedBityOrder.input.amount),
      destinationAmount: parseFloat(mockedBityOrder.output.amount),
      secondsRemaining: mockedBityOrder.validFor,
      validFor: mockedBityOrder.validFor,
      orderTimestampCreatedISOString: mockedBityOrder.timestamp_created,
      paymentAddress: mockedBityOrder.payment_address,
      bityOrderStatus: mockedBityOrder.status,
      orderId: mockedBityOrder.id
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_SUCCEEDED', () => {
    const mockedShapeshiftOrder: types.ShapeshiftOrderResponse = {
      orderId: '64d73218-0ee9-4c6c-9bbd-6da9208595f5',
      pair: 'eth_ant',
      withdrawal: '0x6b3a639eb96d8e0241fe4e114d99e739f906944e',
      withdrawalAmount: '200.13550988',
      deposit: '0x039ed77933388642fdd618d27bfc4fa3582d10c4',
      depositAmount: '0.98872802',
      expiration: 1514633757288,
      quotedRate: '203.47912271',
      maxLimit: 7.04575258,
      apiPubKey:
        '0ca1ccd50b708a3f8c02327f0caeeece06d3ddc1b0ac749a987b453ee0f4a29bdb5da2e53bc35e57fb4bb7ae1f43c93bb098c3c4716375fc1001c55d8c94c160',
      minerFee: '1.05',
      sAddress: '0x055ed77933388642fdn4px9v73j4fa3582d10c4'
    };

    const swapState = reducer.swapReducer(
      undefined,
      actions.shapeshiftOrderCreateSucceededSwap(mockedShapeshiftOrder)
    );

    expect(swapState).toEqual({
      ...reducer.INITIAL_STATE,
      shapeshiftOrder: {
        ...mockedShapeshiftOrder
      },
      isPostingOrder: false,
      originAmount: parseFloat(mockedShapeshiftOrder.depositAmount),
      destinationAmount: parseFloat(mockedShapeshiftOrder.withdrawalAmount),
      secondsRemaining: swapState.secondsRemaining,
      validFor: swapState.validFor,
      orderTimestampCreatedISOString: swapState.orderTimestampCreatedISOString,
      paymentAddress: mockedShapeshiftOrder.deposit,
      paymentId: mockedShapeshiftOrder.deposit,
      shapeshiftOrderStatus: 'no_deposits',
      orderId: mockedShapeshiftOrder.orderId,
      xmrPaymentAddress: mockedShapeshiftOrder.sAddress
    });
  });

  it('should handle SWAP_BITY_ORDER_STATUS_SUCCEEDED', () => {
    const mockedBityResponse: types.BityOrderResponse = {
      input: {
        amount: '1.111',
        currency: 'input_currency',
        reference: 'input_reference',
        status: 'input_status'
      },
      output: {
        amount: '1.111',
        currency: 'output_currency',
        reference: 'output_reference',
        status: 'FILL'
      },
      status: 'status'
    };

    expect(
      reducer.swapReducer(undefined, actions.bityOrderStatusSucceededSwap(mockedBityResponse))
    ).toEqual({
      ...reducer.INITIAL_STATE,
      outputTx: mockedBityResponse.output.reference,
      bityOrderStatus: mockedBityResponse.output.status
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED', () => {
    const mockedShapeshiftResponse: types.ShapeshiftStatusResponse = {
      status: 'complete',
      transaction: '0x039ed77933388642fdd618d27bfc4fa3582d10c4'
    };

    expect(
      reducer.swapReducer(
        undefined,
        actions.shapeshiftOrderStatusSucceededSwap(mockedShapeshiftResponse)
      )
    ).toEqual({
      ...reducer.INITIAL_STATE,
      shapeshiftOrderStatus: mockedShapeshiftResponse.status,
      outputTx: mockedShapeshiftResponse.transaction
    });
  });

  it('should handle SWAP_ORDER_TIME', () => {
    const secondsRemaining = 300;
    expect(reducer.swapReducer(undefined, actions.orderTimeSwap(secondsRemaining))).toEqual({
      ...reducer.INITIAL_STATE,
      secondsRemaining
    });
  });

  it('should handle SWAP_LOAD_BITY_RATES_REQUESTED', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: 'SWAP_LOAD_BITY_RATES_REQUESTED'
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isFetchingRates: true
    });
  });

  it('should handle SWAP_LOAD_SHAPESHIFT_RATE_REQUESTED', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: types.SwapActions.LOAD_SHAPESHIFT_RATES_REQUESTED
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isFetchingRates: true
    });
  });

  it('should handle SWAP_STOP_LOAD_BITY_RATES', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: 'SWAP_STOP_LOAD_BITY_RATES'
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isFetchingRates: false
    });
  });

  it('should handle SWAP_STOP_LOAD_SHAPESHIFT_RATES', () => {
    expect(
      reducer.swapReducer(undefined, {
        type: types.SwapActions.STOP_LOAD_SHAPESHIFT_RATES
      } as types.SwapAction)
    ).toEqual({
      ...reducer.INITIAL_STATE,
      isFetchingRates: false
    });
  });
});
