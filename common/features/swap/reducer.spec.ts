import { normalize } from 'normalizr';

import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';
import tokens from 'config/tokens/eth.json';
import * as swapTypes from './types';
import * as swapActions from './actions';
import * as swapReducer from './reducer';

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

  const normalizedBityRates: swapTypes.NormalizedBityRates = {
    byId: normalize(bityApiResponse, [swapReducer.providerRate]).entities.providerRates,
    allIds: swapReducer.allIds(
      normalize(bityApiResponse, [swapReducer.providerRate]).entities.providerRates
    )
  };
  const normalizedShapeshiftRates: swapTypes.NormalizedShapeshiftRates = {
    byId: normalize(shapeshiftApiResponse, [swapReducer.providerRate]).entities.providerRates,
    allIds: swapReducer.allIds(
      normalize(shapeshiftApiResponse, [swapReducer.providerRate]).entities.providerRates
    )
  };
  const normalizedBityOptions: swapTypes.NormalizedOptions = {
    byId: normalize(bityApiResponse, [swapReducer.providerRate]).entities.options,
    allIds: swapReducer.allIds(
      normalize(bityApiResponse, [swapReducer.providerRate]).entities.options
    )
  };
  const normalizedShapeshiftOptions: swapTypes.NormalizedOptions = {
    byId: normalize(shapeshiftApiResponse, [swapReducer.providerRate]).entities.options,
    allIds: swapReducer.allIds(
      normalize(shapeshiftApiResponse, [swapReducer.providerRate]).entities.options
    )
  };

  it('should handle SWAP_LOAD_BITY_RATES_SUCCEEDED', () => {
    expect(
      swapReducer.swapReducer(undefined, swapActions.loadBityRatesSucceededSwap(bityApiResponse))
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isFetchingRates: false,
      bityRates: normalizedBityRates,
      options: normalizedBityOptions
    });
  });

  it('should handle SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED', () => {
    expect(
      swapReducer.swapReducer(
        undefined,
        swapActions.loadShapeshiftRatesSucceededSwap(shapeshiftApiResponse as any)
      )
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isFetchingRates: false,
      shapeshiftRates: normalizedShapeshiftRates,
      options: normalizedShapeshiftOptions
    });
  });

  it('should handle SWAP_STEP', () => {
    const step = 2;
    expect(swapReducer.swapReducer(undefined, swapActions.changeStepSwap(step))).toEqual({
      ...swapReducer.INITIAL_STATE,
      step
    });
  });

  it('should handle SWAP_DESTINATION_ADDRESS', () => {
    const destinationAddress = '341a0sdf83';
    expect(
      swapReducer.swapReducer(undefined, swapActions.destinationAddressSwap(destinationAddress))
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      destinationAddress
    });
  });

  it('should handle SWAP_RESTART', () => {
    expect(
      swapReducer.swapReducer(
        {
          ...swapReducer.INITIAL_STATE,
          bityRates: normalizedBityRates,
          shapeshiftRates: normalizedShapeshiftRates,
          origin: { label: 'BTC', amount: 1 },
          destination: { label: 'ETH', amount: 3 }
        },
        swapActions.restartSwap()
      )
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      bityRates: normalizedBityRates,
      shapeshiftRates: normalizedShapeshiftRates
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_REQUESTED', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: swapTypes.SwapActions.BITY_ORDER_CREATE_REQUESTED
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: swapTypes.SwapActions.BITY_ORDER_CREATE_REQUESTED
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_FAILED', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: swapTypes.SwapActions.BITY_ORDER_CREATE_FAILED
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isPostingOrder: false
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_FAILED', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: swapTypes.SwapActions.SHAPESHIFT_ORDER_CREATE_FAILED
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isPostingOrder: false
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_SUCCEEDED', () => {
    const mockedBityOrder: swapTypes.BityOrderPostResponse = {
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
      swapReducer.swapReducer(undefined, swapActions.bityOrderCreateSucceededSwap(mockedBityOrder))
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
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
    const mockedShapeshiftOrder: swapTypes.ShapeshiftOrderResponse = {
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
      minerFee: '1.05'
    };

    const swapState = swapReducer.swapReducer(
      undefined,
      swapActions.shapeshiftOrderCreateSucceededSwap(mockedShapeshiftOrder)
    );

    expect(swapState).toEqual({
      ...swapReducer.INITIAL_STATE,
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
      shapeshiftOrderStatus: 'no_deposits',
      orderId: mockedShapeshiftOrder.orderId
    });
  });

  it('should handle SWAP_BITY_ORDER_STATUS_SUCCEEDED', () => {
    const mockedBityResponse: swapTypes.BityOrderResponse = {
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
      swapReducer.swapReducer(
        undefined,
        swapActions.bityOrderStatusSucceededSwap(mockedBityResponse)
      )
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      outputTx: mockedBityResponse.output.reference,
      bityOrderStatus: mockedBityResponse.output.status
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED', () => {
    const mockedShapeshiftResponse: swapTypes.ShapeshiftStatusResponse = {
      status: 'complete',
      transaction: '0x039ed77933388642fdd618d27bfc4fa3582d10c4'
    };

    expect(
      swapReducer.swapReducer(
        undefined,
        swapActions.shapeshiftOrderStatusSucceededSwap(mockedShapeshiftResponse)
      )
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      shapeshiftOrderStatus: mockedShapeshiftResponse.status,
      outputTx: mockedShapeshiftResponse.transaction
    });
  });

  it('should handle SWAP_ORDER_TIME', () => {
    const secondsRemaining = 300;
    expect(swapReducer.swapReducer(undefined, swapActions.orderTimeSwap(secondsRemaining))).toEqual(
      {
        ...swapReducer.INITIAL_STATE,
        secondsRemaining
      }
    );
  });

  it('should handle SWAP_LOAD_BITY_RATES_REQUESTED', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: 'SWAP_LOAD_BITY_RATES_REQUESTED'
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isFetchingRates: true
    });
  });

  it('should handle SWAP_LOAD_SHAPESHIFT_RATE_REQUESTED', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: swapTypes.SwapActions.LOAD_SHAPESHIFT_RATES_REQUESTED
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isFetchingRates: true
    });
  });

  it('should handle SWAP_STOP_LOAD_BITY_RATES', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: 'SWAP_STOP_LOAD_BITY_RATES'
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isFetchingRates: false
    });
  });

  it('should handle SWAP_STOP_LOAD_SHAPESHIFT_RATES', () => {
    expect(
      swapReducer.swapReducer(undefined, {
        type: swapTypes.SwapActions.STOP_LOAD_SHAPESHIFT_RATES
      } as swapTypes.SwapAction)
    ).toEqual({
      ...swapReducer.INITIAL_STATE,
      isFetchingRates: false
    });
  });
});
