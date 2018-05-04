import { configuredStore } from 'store';
import deterministicWallets, { INITIAL_STATE, deterministicWalletsActions } from './';
import { ITokenValues, DeterministicWalletData } from './types';
import { TokenValue } from 'libs/units';

configuredStore.getState();

describe('deterministicWallets reducer', () => {
  const tokenValues: ITokenValues = {
    OMG: {
      value: TokenValue('0'),
      decimal: 16
    }
  };

  const wallet: DeterministicWalletData = {
    index: 0,
    address: 'address',
    value: TokenValue('0'),
    tokenValues
  };

  it('should handle DW_SET_WALLETS', () => {
    const wallets = [wallet];
    expect(
      deterministicWallets(undefined, deterministicWalletsActions.setDeterministicWallets(wallets))
    ).toEqual({
      ...INITIAL_STATE,
      wallets
    });
  });

  it('should handle DW_SET_DESIRED_TOKEN', () => {
    const desiredToken = 'OMG';
    expect(
      deterministicWallets(undefined, deterministicWalletsActions.setDesiredToken(desiredToken))
    ).toEqual({
      ...INITIAL_STATE,
      desiredToken
    });
  });

  it('should handle DW_UPDATE_WALLET', () => {
    const wallet1 = {
      ...wallet,
      address: 'wallet1'
    };
    const wallet2 = {
      ...wallet,
      address: 'wallet2'
    };
    const wallets = [wallet1, wallet2];
    const state = deterministicWallets(
      undefined,
      deterministicWalletsActions.setDeterministicWallets(wallets)
    );

    const wallet2Update = {
      ...wallet,
      index: 100,
      address: 'wallet2',
      value: TokenValue('100')
    };

    expect(
      deterministicWallets(
        state,
        deterministicWalletsActions.updateDeterministicWallet(wallet2Update)
      )
    ).toEqual({
      ...INITIAL_STATE,
      wallets: [wallet1, wallet2Update]
    });
  });
});
