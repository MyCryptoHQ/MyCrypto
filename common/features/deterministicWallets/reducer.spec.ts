import { TokenValue } from 'libs/units';
import configuredStore from 'features/store';
import * as deterministicWalletsTypes from './types';
import * as deterministicWalletsActions from './actions';
import * as deterministicWalletsReducer from './reducer';

configuredStore.getState();

describe('deterministicWallets reducer', () => {
  const tokenValues: deterministicWalletsTypes.ITokenValues = {
    OMG: {
      value: TokenValue('0'),
      decimal: 16
    }
  };

  const wallet: deterministicWalletsTypes.DeterministicWalletData = {
    index: 0,
    address: 'address',
    value: TokenValue('0'),
    tokenValues
  };

  it('should handle DW_SET_WALLETS', () => {
    const wallets = [wallet];
    expect(
      deterministicWalletsReducer.deterministicWalletsReducer(
        undefined,
        deterministicWalletsActions.setDeterministicWallets(wallets)
      )
    ).toEqual({
      ...deterministicWalletsReducer.INITIAL_STATE,
      wallets
    });
  });

  it('should handle DW_SET_DESIRED_TOKEN', () => {
    const desiredToken = 'OMG';
    expect(
      deterministicWalletsReducer.deterministicWalletsReducer(
        undefined,
        deterministicWalletsActions.setDesiredToken(desiredToken)
      )
    ).toEqual({
      ...deterministicWalletsReducer.INITIAL_STATE,
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
    const state = deterministicWalletsReducer.deterministicWalletsReducer(
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
      deterministicWalletsReducer.deterministicWalletsReducer(
        state,
        deterministicWalletsActions.updateDeterministicWallet(wallet2Update)
      )
    ).toEqual({
      ...deterministicWalletsReducer.INITIAL_STATE,
      wallets: [wallet1, wallet2Update]
    });
  });
});
