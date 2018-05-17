import { CustomNetworkConfig } from 'types/network';
import { addCustomNetwork, removeCustomNetwork } from '../../actions';
import customNetworks from './reducers';

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
    expect(customNetworks(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle adding the first custom network', () =>
    expect(customNetworks(expectedState.initialState, actions.addFirstCustomNetwork)).toEqual(
      expectedState.addFirstCustomNetwork
    ));

  it('should handle adding the second custom network', () =>
    expect(
      customNetworks(expectedState.addFirstCustomNetwork, actions.addSecondCustomNetwork)
    ).toEqual(expectedState.addSecondCustomNetwork));

  it('should handle removing the first custom network', () =>
    expect(
      customNetworks(expectedState.addSecondCustomNetwork, actions.removeFirstCustomNetwork)
    ).toEqual(expectedState.removeFirstCustomNetwork));
});
