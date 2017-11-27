import { generateWallet, INITIAL_STATE } from 'reducers/generateWallet';
import * as generateWalletActions from 'actions/generateWallet';
import Wallet from 'ethereumjs-wallet';

describe('generateWallet reducer', () => {
  it('should handle GENERATE_WALLET_GENERATE_WALLET', () => {
    const { wallet, password, activeStep } = generateWallet(
      undefined,
      generateWalletActions.generateNewWallet('password')
    );

    expect(wallet).toBeInstanceOf(Wallet);
    expect(password).toEqual('password');
    expect(activeStep).toEqual('download');
  });

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
