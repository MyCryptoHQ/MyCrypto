import { swap, INITIAL_STATE, ALL_CRYPTO_KIND_OPTIONS } from 'reducers/swap';
import {
  buildDestinationAmount,
  buildDestinationKind,
  buildOriginKind
} from 'reducers/swap/helpers';
import * as swapActions from 'actions/swap';
import without from 'lodash/without';

describe('swap reducer', () => {
  it('should handle SWAP_ORIGIN_KIND', () => {
    const newOriginKind = 'ETH';
    const newDestinationKind = buildDestinationKind(
      newOriginKind,
      INITIAL_STATE.destinationKind
    );
    const fakeBityRates = {
      BTCETH: 10,
      ETHBTC: 0.01
    };
    expect(swap(undefined, swapActions.originKindSwap(newOriginKind))).toEqual({
      ...INITIAL_STATE,
      originKind: newOriginKind,
      destinationKind: newDestinationKind,
      destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, newOriginKind),
      destinationAmount: buildDestinationAmount(
        INITIAL_STATE.originAmount,
        newOriginKind,
        newDestinationKind,
        fakeBityRates
      )
    });
  });

  it('should handle SWAP_DESTINATION_KIND', () => {
    const newDestinationKind = 'REP';
    const newOriginKind = buildOriginKind(
      INITIAL_STATE.originKind,
      newDestinationKind
    );
    const fakeBityRates = {
      BTCETH: 10,
      ETHBTC: 0.01
    };
    expect(
      swap(undefined, swapActions.destinationKindSwap(newDestinationKind))
    ).toEqual({
      ...INITIAL_STATE,
      destinationKind: newDestinationKind,
      destinationKindOptions: without(ALL_CRYPTO_KIND_OPTIONS, newOriginKind),
      destinationAmount: buildDestinationAmount(
        INITIAL_STATE.originAmount,
        newOriginKind,
        newDestinationKind,
        fakeBityRates
      )
    });
  });

  it('should handle SWAP_ORIGIN_AMOUNT', () => {
    const originAmount = 2;
    expect(
      swap(undefined, swapActions.originAmountSwap(originAmount))
    ).toEqual({
      ...INITIAL_STATE,
      originAmount
    });
  });

  it('should handle SWAP_DESTINATION_AMOUNT', () => {
    const destinationAmount = 2;
    expect(
      swap(undefined, swapActions.destinationAmountSwap(destinationAmount))
    ).toEqual({
      ...INITIAL_STATE,
      destinationAmount
    });
  });

  it('should handle SWAP_LOAD_BITY_RATES_SUCCEEDED', () => {
    const bityRates = {
      BTCETH: 0.01,
      ETHREP: 10,
      ETHBTC: 0,
      BTCREP: 0
    };
    expect(
      swap(undefined, swapActions.loadBityRatesSucceededSwap(bityRates))
    ).toEqual({
      ...INITIAL_STATE,
      isFetchingRates: false,
      bityRates
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
    expect(
      swap(undefined, swapActions.destinationAddressSwap(destinationAddress))
    ).toEqual({
      ...INITIAL_STATE,
      destinationAddress
    });
  });

  it('should handle SWAP_RESTART', () => {
    const bityRates = {
      BTCETH: 0.01,
      ETHREP: 10
    };
    expect(
      swap(
        {
          ...INITIAL_STATE,
          bityRates,
          originAmount: 1
        },
        swapActions.restartSwap()
      )
    ).toEqual({
      ...INITIAL_STATE,
      bityRates
    });
  });

  it('should handle SWAP_ORDER_CREATE_REQUESTED', () => {
    expect(
      swap(undefined, {
        type: 'SWAP_ORDER_CREATE_REQUESTED'
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isPostingOrder: true
    });
  });

  it('should handle SWAP_ORDER_CREATE_FAILED', () => {
    expect(
      swap(undefined, {
        type: 'SWAP_ORDER_CREATE_FAILED'
      } as swapActions.SwapAction)
    ).toEqual({
      ...INITIAL_STATE,
      isPostingOrder: false
    });
  });

  // TODO
  // it('should handle SWAP_BITY_ORDER_CREATE_SUCCEEDED', () => {
  // });
  //
  // it('should handle SWAP_BITY_ORDER_STATUS_SUCCEEDED', () => {
  // });

  it('should handle SWAP_ORDER_TIME', () => {
    const secondsRemaining = 300;
    expect(
      swap(undefined, swapActions.orderTimeSwap(secondsRemaining))
    ).toEqual({
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
});
