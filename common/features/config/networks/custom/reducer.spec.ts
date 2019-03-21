import { CustomNetworkConfig } from 'types/network';
import * as actions from './actions';
import { customNetworksReducer } from './reducer';

const firstCustomNetwork: CustomNetworkConfig = {
  isCustom: true,
  id: '111',
  chainId: 111,
  name: 'First Custom Network',
  unit: 'customNetworkUnit',
  dPathFormats: null
};

const secondCustomNetwork: CustomNetworkConfig = {
  ...firstCustomNetwork,
  id: '222',
  chainId: 222,
  name: 'Second Custom Network'
};

const expectedState = {
  initialState: {},
  addFirstCustomNetwork: { [firstCustomNetwork.id]: firstCustomNetwork },
  addSecondCustomNetwork: {
    [firstCustomNetwork.id]: firstCustomNetwork,
    [secondCustomNetwork.id]: secondCustomNetwork
  },
  removeFirstCustomNetwork: { [secondCustomNetwork.id]: secondCustomNetwork }
};

const actionsToDispatch = {
  addFirstCustomNetwork: actions.addCustomNetwork(firstCustomNetwork),
  addSecondCustomNetwork: actions.addCustomNetwork(secondCustomNetwork),
  removeFirstCustomNetwork: actions.removeCustomNetwork(firstCustomNetwork.id)
};

describe('custom networks reducer', () => {
  it('should return the intial state', () =>
    expect(customNetworksReducer(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle adding the first custom network', () =>
    expect(
      customNetworksReducer(expectedState.initialState, actionsToDispatch.addFirstCustomNetwork)
    ).toEqual(expectedState.addFirstCustomNetwork));

  it('should handle adding the second custom network', () =>
    expect(
      customNetworksReducer(
        expectedState.addFirstCustomNetwork,
        actionsToDispatch.addSecondCustomNetwork
      )
    ).toEqual(expectedState.addSecondCustomNetwork));

  it('should handle removing the first custom network', () =>
    expect(
      customNetworksReducer(
        expectedState.addSecondCustomNetwork,
        actionsToDispatch.removeFirstCustomNetwork
      )
    ).toEqual(expectedState.removeFirstCustomNetwork));
});

export { actions as customNetworksActions, expectedState as customNetworksExpectedState };
