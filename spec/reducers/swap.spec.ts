import { swap, INITIAL_STATE } from 'reducers/swap';
import * as swapActions from 'actions/swap';
import {
  NormalizedBityRates,
  NormalizedOptions,
  NormalizedShapeshiftRates
} from 'reducers/swap/types';
import { normalize } from 'normalizr';
import * as schema from 'reducers/swap/schema';
import { TypeKeys } from 'actions/swap/constants';
import tokens from 'config/tokens/eth.json';
import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';

describe('ensure whitelist', () => {
  const findToken = (tkn: string) => tokens.find(t => t.symbol === tkn);
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

  const normalizedBityRates: NormalizedBityRates = {
    byId: normalize(bityApiResponse, [schema.providerRate]).entities.providerRates,
    allIds: schema.allIds(normalize(bityApiResponse, [schema.providerRate]).entities.providerRates)
  };
  const normalizedShapeshiftRates: NormalizedShapeshiftRates = {
    byId: normalize(shapeshiftApiResponse, [schema.providerRate]).entities.providerRates,
    allIds: schema.allIds(
      normalize(shapeshiftApiResponse, [schema.providerRate]).entities.providerRates
    )
  };
  const normalizedBityOptions: NormalizedOptions = {
    byId: normalize(bityApiResponse, [schema.providerRate]).entities.options,
    allIds: schema.allIds(normalize(bityApiResponse, [schema.providerRate]).entities.options)
  };
  const normalizedShapeshiftOptions: NormalizedOptions = {
    byId: normalize(shapeshiftApiResponse, [schema.providerRate]).entities.options,
    allIds: schema.allIds(normalize(shapeshiftApiResponse, [schema.providerRate]).entities.options)
  };

  it('should handle SWAP_LOAD_BITY_RATES_SUCCEEDED', () => {
    expect(swap(undefined, swapActions.loadBityRatesSucceededSwap(bityApiResponse))).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: false,
      bityRates: normalizedBityRates,
      options: normalizedBityOptions
    });
  });

  it('should handle SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED', () => {
    expect(
      swap(undefined, swapActions.loadShapeshiftRatesSucceededSwap(shapeshiftApiResponse))
    ).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: false,
      shapeshiftRates: normalizedShapeshiftRates,
      options: normalizedShapeshiftOptions
    });
  });

  it('should handle SWAP_STEP', () => {
    const step = 2;
    expect(swap(undefined, swapActions.changeStepSwap(step))).toEqual({
      ...INITIAL_STATE,
      step
    });
  });

  it('should handle SWAP_DESTINATION_ADDRESS', () => {
    const destinationAddress = '341a0sdf83';
    expect(swap(undefined, swapActions.destinationAddressSwap(destinationAddress))).toEqual({
      ...INITIAL_STATE,
      destinationAddress
    });
  });

  it('should handle SWAP_RESTART', () => {
    expect(
      swap(
        {
          ...INITIAL_STATE,
          bityRates: normalizedBityRates,
          shapeshiftRates: normalizedShapeshiftRates,
          origin: { id: 'BTC', amount: 1 },
          destination: { id: 'ETH', amount: 3 }
        },
        swapActions.restartSwap()
      )
    ).toEqual({
      ...INITIAL_STATE,
      bityRates: normalizedBityRates,
      shapeshiftRates: normalizedShapeshiftRates
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_REQUESTED', () => {
    expect(
      swap(undefined, {
        type: TypeKeys.SWAP_BITY_ORDER_CREATE_REQUESTED
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED', () => {
    expect(
      swap(undefined, {
        type: TypeKeys.SWAP_BITY_ORDER_CREATE_REQUESTED
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_FAILED', () => {
    expect(
      swap(undefined, {
        type: TypeKeys.SWAP_BITY_ORDER_CREATE_FAILED
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isPostingOrder: false
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_CREATE_FAILED', () => {
    expect(
      swap(undefined, {
        type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_FAILED
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isPostingOrder: false
    });
  });

  it('should handle SWAP_BITY_ORDER_CREATE_SUCCEEDED', () => {
    const mockedBityOrder: swapActions.BityOrderPostResponse = {
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

    expect(swap(undefined, swapActions.bityOrderCreateSucceededSwap(mockedBityOrder))).toEqual({
      ...INITIAL_STATE,
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
    const mockedShapeshiftOrder: swapActions.ShapeshiftOrderResponse = {
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

    const swapState = swap(
      undefined,
      swapActions.shapeshiftOrderCreateSucceededSwap(mockedShapeshiftOrder)
    );

    expect(swapState).toEqual({
      ...INITIAL_STATE,
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
    const mockedBityResponse: swapActions.BityOrderResponse = {
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

    expect(swap(undefined, swapActions.bityOrderStatusSucceededSwap(mockedBityResponse))).toEqual({
      ...INITIAL_STATE,
      outputTx: mockedBityResponse.output.reference,
      bityOrderStatus: mockedBityResponse.output.status
    });
  });

  it('should handle SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED', () => {
    const mockedShapeshiftResponse: swapActions.ShapeshiftStatusResponse = {
      status: 'complete',
      transaction: '0x039ed77933388642fdd618d27bfc4fa3582d10c4'
    };

    expect(
      swap(undefined, swapActions.shapeshiftOrderStatusSucceededSwap(mockedShapeshiftResponse))
    ).toEqual({
      ...INITIAL_STATE,
      shapeshiftOrderStatus: mockedShapeshiftResponse.status,
      outputTx: mockedShapeshiftResponse.transaction
    });
  });

  it('should handle SWAP_ORDER_TIME', () => {
    const secondsRemaining = 300;
    expect(swap(undefined, swapActions.orderTimeSwap(secondsRemaining))).toEqual({
      ...INITIAL_STATE,
      secondsRemaining
    });
  });

  it('should handle SWAP_LOAD_BITY_RATES_REQUESTED', () => {
    expect(
      swap(undefined, {
        type: 'SWAP_LOAD_BITY_RATES_REQUESTED'
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: true
    });
  });

  it('should handle SWAP_LOAD_SHAPESHIFT_RATE_REQUESTED', () => {
    expect(
      swap(undefined, {
        type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: true
    });
  });

  it('should handle SWAP_STOP_LOAD_BITY_RATES', () => {
    expect(
      swap(undefined, {
        type: 'SWAP_STOP_LOAD_BITY_RATES'
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: false
    });
  });

  it('should handle SWAP_STOP_LOAD_SHAPESHIFT_RATES', () => {
    expect(
      swap(undefined, {
        type: TypeKeys.SWAP_STOP_LOAD_SHAPESHIFT_RATES
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: false
    });
  });
});
