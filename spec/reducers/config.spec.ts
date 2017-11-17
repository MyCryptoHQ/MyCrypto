import { config, INITIAL_STATE } from 'reducers/config';
import * as configActions from 'actions/config';
import { NODES } from 'config/data';
import { makeCustomNodeId, makeNodeConfigFromCustomConfig } from 'utils/node';

const custNode = {
  name: 'Test Config',
  url: 'http://somecustomconfig.org/',
  port: 443,
  network: 'ETH'
};

describe('config reducer', () => {
  it('should handle CONFIG_LANGUAGE_CHANGE', () => {
    const language = 'en';
    expect(config(undefined, configActions.changeLanguage(language))).toEqual({
      ...INITIAL_STATE,
      languageSelection: language
    });
  });

  it('should handle CONFIG_NODE_CHANGE', () => {
    const key = Object.keys(NODES)[0];

    expect(
      config(undefined, configActions.changeNode(key, NODES[key]))
    ).toEqual({
      ...INITIAL_STATE,
      node: NODES[key],
      nodeSelection: key
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

  it('should handle CONFIG_ADD_CUSTOM_NODE', () => {
    expect(config(undefined, configActions.addCustomNode(custNode))).toEqual({
      ...INITIAL_STATE,
      customNodes: [custNode]
    });
  });

  describe('should handle CONFIG_REMOVE_CUSTOM_NODE', () => {
    const customNodeId = makeCustomNodeId(custNode);
    const addedState = config(undefined, configActions.addCustomNode(custNode));
    const addedAndActiveState = config(
      addedState,
      configActions.changeNode(
        customNodeId,
        makeNodeConfigFromCustomConfig(custNode)
      )
    );
    const removedState = config(
      addedAndActiveState,
      configActions.removeCustomNode(custNode)
    );

    it('should remove the custom node from `customNodes`', () => {
      expect(removedState.customNodes.length).toBe(0);
    });

    it('should change the active node, if the custom one was active', () => {
      expect(removedState.nodeSelection === customNodeId).toBeFalsy();
    });
  });

  it('should handle CONFIG_SET_LATEST_BLOCK', () => {
    expect(config(undefined, configActions.setLatestBlock('12345'))).toEqual({
      ...INITIAL_STATE,
      latestBlock: '12345'
    });
  });
});
