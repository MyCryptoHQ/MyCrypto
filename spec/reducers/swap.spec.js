import { swap, INITIAL_STATE } from 'reducers/swap';
import * as swapActions from 'actions/swap';

describe('swap reducer', () => {
  it('should return the initial state', () => {
    expect(swap(undefined, {})).toEqual(INITIAL_STATE);
  });

  it('should handle SWAP_STEP', () => {
    const step = 2;
    expect(swap(undefined, swapActions.changeStepSwap(step))).toEqual({
      ...INITIAL_STATE,
      step
    });
  });

  // TODO
  // it('should handle SWAP_ORIGIN_KIND', () => {
  //   const originKind = 'ETH';
  //   expect(swap(undefined, swapActions.originKindSwap(originKind))).toEqual({
  //     ...INITIAL_STATE,
  //     originKind
  //   });
  // });

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

  it('should handle SWAP_DESTINATION_ADDRESS', () => {
    // TODO - should reducer throw if address is not in correct format?
    const destinationAddress = '341a0sdf83';
    expect(
      swap(undefined, swapActions.destinationAddressSwap(destinationAddress))
    ).toEqual({
      ...INITIAL_STATE,
      destinationAddress
    });
  });

  it('should handle SWAP_RESTART', () => {
    // TODO - should reducer throw if address is not in correct format?
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

  it('should handle SWAP_ORDER_TIME', () => {
    const secondsRemaining = 300;
    expect(
      swap(undefined, swapActions.orderTimeSwap(secondsRemaining))
    ).toEqual({
      ...INITIAL_STATE,
      secondsRemaining
    });
  });
});
