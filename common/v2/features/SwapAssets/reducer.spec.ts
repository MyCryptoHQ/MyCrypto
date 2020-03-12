import { ITxStatus } from 'v2/types';

import { SwapState } from './types';
import { SwapFlowReducer, swapFlowInitialState } from './reducer';

const currState = {
  ...swapFlowInitialState,
  transactions: [{ status: ITxStatus.BROADCASTED, txHash: 'testHash' }]
};
describe('SwapFlowReducer', () => {
  it('Updates tx status on CONFIRM_TX_SUCCESS', () => {
    const receipt = { transactionHash: 'testHash' };
    const state = SwapFlowReducer(currState as SwapState, {
      type: 'CONFIRM_TX_SUCCESS',
      payload: { receipt }
    });
    expect(state.transactions[0].status).toEqual(ITxStatus.CONFIRMED);
  });
});
