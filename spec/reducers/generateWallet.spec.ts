import { generateWallet, INITIAL_STATE } from 'reducers/generateWallet';
import * as generateWalletActions from 'actions/generateWallet';

describe('generateWallet reducer', () => {
  it('should handle GENERATE_WALLET_CONTINUE_TO_PAPER', () => {
    expect(
      generateWallet(undefined, generateWalletActions.continueToPaper())
    ).toEqual({
      ...INITIAL_STATE,
      activeStep: 'paper'
    });
  });

  it('should handle GENERATE_WALLET_RESET', () => {
    expect(
      generateWallet(undefined, generateWalletActions.resetGenerateWallet())
    ).toEqual({
      ...INITIAL_STATE
    });
  });
});
