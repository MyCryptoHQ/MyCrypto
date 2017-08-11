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

  // it('should handle SWAP_ORIGIN_KIND', () => {
  //   const originKind = 'ETH';
  //   expect(swap(undefined, swapActions.originKindSwap(originKind))).toEqual({
  //     ...INITIAL_STATE,
  //     originKind
  //   });
  // });
});
