import { config, INITIAL_STATE } from 'reducers/config';
import * as configActions from 'actions/config';
import { NODES } from 'config/data';

describe('config reducer', () => {
  it('should handle CONFIG_LANGUAGE_CHANGE', () => {
    const language = 'en';
    expect(config(undefined, configActions.changeLanguage(language))).toEqual({
      ...INITIAL_STATE,
      languageSelection: language
    });
  });

  it('should handle CONFIG_NODE_CHANGE', () => {
    const node = Object.keys(NODES)[0];

    expect(config(undefined, configActions.changeNode(node))).toEqual({
      ...INITIAL_STATE,
      nodeSelection: node
    });
  });

  it('should handle CONFIG_GAS_PRICE', () => {
    const gasPrice = 20;

    expect(config(undefined, configActions.changeGasPrice(gasPrice))).toEqual({
      ...INITIAL_STATE,
      gasPriceGwei: gasPrice
    });
  });

  it('should handle CONFIG_TOGGLE_OFFLINE', () => {
    const offlineState = {
      ...INITIAL_STATE,
      offline: true
    };

    const onlineState = {
      ...INITIAL_STATE,
      offline: false
    };

    expect(config(offlineState, configActions.toggleOfflineConfig())).toEqual({
      ...offlineState,
      offline: false
    });

    expect(config(onlineState, configActions.toggleOfflineConfig())).toEqual({
      ...onlineState,
      offline: true
    });
  });

  it('should handle CONFIG_FORCE_OFFLINE', () => {
    const forceOfflineTrue = {
      ...INITIAL_STATE,
      forceOffline: true
    };

    const forceOfflineFalse = {
      ...INITIAL_STATE,
      forceOffline: false
    };

    expect(
      config(forceOfflineTrue, configActions.forceOfflineConfig())
    ).toEqual({
      ...forceOfflineTrue,
      forceOffline: false
    });

    expect(
      config(forceOfflineFalse, configActions.forceOfflineConfig())
    ).toEqual({
      ...forceOfflineFalse,
      forceOffline: true
    });
  });
});
