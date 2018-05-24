import { CustomNetworkConfig } from 'types/network';
import { addCustomNetwork, removeCustomNetwork, customNetworksReducer } from './';

describe('custom networks reducer', () => {
  const firstCustomNetworkId = 'firstCustomNetwork';
  const firstCustomNetworkConfig: CustomNetworkConfig = {
    isCustom: true,
    chainId: 1,
    name: firstCustomNetworkId,
    unit: 'customNetworkUnit',
    dPathFormats: null
  };

  const secondCustomNetworkId = 'secondCustomNetwork';
  const secondCustomNetworkConfig: CustomNetworkConfig = {
    ...firstCustomNetworkConfig,
    name: secondCustomNetworkId
  };

  const expectedState = {
    initialState: {},
    addFirstCustomNetwork: { [firstCustomNetworkId]: firstCustomNetworkConfig },
    addSecondCustomNetwork: {
      [firstCustomNetworkId]: firstCustomNetworkConfig,
      [secondCustomNetworkId]: secondCustomNetworkConfig
    },
    removeFirstCustomNetwork: { [secondCustomNetworkId]: secondCustomNetworkConfig }
  };

  const actions = {
    addFirstCustomNetwork: addCustomNetwork({
      id: firstCustomNetworkId,
      config: firstCustomNetworkConfig
    }),
    addSecondCustomNetwork: addCustomNetwork({
      config: secondCustomNetworkConfig,
      id: secondCustomNetworkId
    }),
    removeFirstCustomNetwork: removeCustomNetwork({ id: firstCustomNetworkId })
  };
  it('should return the intial state', () =>
    expect(customNetworksReducer(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle adding the first custom network', () =>
    expect(
      customNetworksReducer(expectedState.initialState, actions.addFirstCustomNetwork)
    ).toEqual(expectedState.addFirstCustomNetwork));

  it('should handle adding the second custom network', () =>
    expect(
      customNetworksReducer(expectedState.addFirstCustomNetwork, actions.addSecondCustomNetwork)
    ).toEqual(expectedState.addSecondCustomNetwork));

  it('should handle removing the first custom network', () =>
    expect(
      customNetworksReducer(expectedState.addSecondCustomNetwork, actions.removeFirstCustomNetwork)
    ).toEqual(expectedState.removeFirstCustomNetwork));
});
