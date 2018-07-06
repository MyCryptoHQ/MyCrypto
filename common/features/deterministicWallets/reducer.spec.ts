import { TokenValue } from 'libs/units';
import configuredStore from 'features/store';
import * as types from './types';
import * as actions from './actions';
import * as reducer from './reducer';

configuredStore.getState();

describe('deterministicWallets reducer', () => {
  const tokenValues: types.ITokenValues = {
    OMG: {
      value: TokenValue('0'),
      decimal: 16
    }
  };

  const wallet: types.DeterministicWalletData = {
    index: 0,
    address: 'address',
    value: TokenValue('0'),
    tokenValues
  };

  it('should handle DW_SET_WALLETS', () => {
    const wallets = [wallet];
    expect(
      reducer.deterministicWalletsReducer(undefined, actions.setDeterministicWallets(wallets))
    ).toEqual({
      ...reducer.INITIAL_STATE,
      wallets
    });
  });

  it('should handle DW_SET_DESIRED_TOKEN', () => {
    const desiredToken = 'OMG';
    expect(
      reducer.deterministicWalletsReducer(undefined, actions.setDesiredToken(desiredToken))
    ).toEqual({
      ...reducer.INITIAL_STATE,
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
    const state = reducer.deterministicWalletsReducer(
      undefined,
      actions.setDeterministicWallets(wallets)
    );

    const wallet2Update = {
      ...wallet,
      index: 100,
      address: 'wallet2',
      value: TokenValue('100')
    };

    expect(
      reducer.deterministicWalletsReducer(state, actions.updateDeterministicWallet(wallet2Update))
    ).toEqual({
      ...reducer.INITIAL_STATE,
      wallets: [wallet1, wallet2Update]
    });
  });
});
