import { expectSaga } from 'test-utils';

import { fAccount, fAccounts, fContacts, fContracts, fNetwork, fNetworks } from '@fixtures';
import { EthersJS } from '@services/EthService/network/ethersJsProvider';
import { Network, NetworkId } from '@types';
import { isEmpty } from '@vendor';

import {
  canDeleteNode,
  deleteNode,
  deleteNodeOrNetworkWorker,
  deleteNodeWorker,
  initialState,
  default as slice
} from './network.slice';
import { AppState } from './reducer';

const reducer = slice.reducer;
const { create, createMany, destroy, update, updateMany, reset } = slice.actions;

describe('NetworkSlice', () => {
  it('has an initialState', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(isEmpty(expected)).toBeFalsy();
    expect(actual).toEqual(expected);
  });

  it('create(): adds an entity by id', () => {
    const entity = { id: 'Ethereum' } as Network;
    const actual = reducer([], create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('createMany(): adds multiple entities by id', () => {
    const a1 = { id: 'Ropsten' } as Network;
    const a2 = { id: 'Kovan' } as Network;
    const a3 = { id: 'Rinkeby' } as Network;
    const actual = reducer([a1], createMany([a2, a3]));
    const expected = [a1, a2, a3];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by id', () => {
    const a1 = { id: 'Ropsten' } as Network;
    const a2 = { id: 'Rinkeby' } as Network;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.id));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { id: 'Ropsten', name: 'ropsteen' } as Network;
    const state = [entity];
    const modifiedEntity = { ...entity, name: 'ropsten' } as Network;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });

  it('updateMany(): updates mulitple entities', () => {
    const a1 = { id: 'Rinkeby', name: 'rinkeby' } as Network;
    const a2 = { id: 'Ropsten', name: 'ropsten' } as Network;
    const a3 = { id: 'Goerli', name: 'goerli' } as Network;
    const state = [a1, a2, a3];
    const modifiedEntities = [
      { ...a1, name: 'Rink' } as Network,
      { ...a2, name: 'Rops' } as Network
    ];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = [...modifiedEntities, a3];
    expect(actual).toEqual(expected);
  });

  it('deleteNode(): deletes node', () => {
    const payload = { network: 'Ethereum' as NetworkId, nodeName: 'eth_mycrypto' };
    const state = [fNetworks[0]];
    const expected = [
      { ...fNetworks[0], nodes: [fNetworks[0].nodes[1]], selectedNode: 'eth_ethscan' }
    ];
    const actual = reducer(state, deleteNode(payload));
    expect(actual).toEqual(expected);
  });

  it('deleteNode(): deletes node and sets selected node to autoNode', () => {
    const payload = { network: 'Ethereum' as NetworkId, nodeName: 'eth_ethscan' };
    const state = [{ ...fNetworks[0], selectedNode: 'eth_ethscan', autoNode: 'eth_mycrypto' }];
    const expected = [
      {
        ...fNetworks[0],
        nodes: [fNetworks[0].nodes[0]],
        selectedNode: 'eth_mycrypto',
        autoNode: 'eth_mycrypto'
      }
    ];
    const actual = reducer(state, deleteNode(payload));
    expect(actual).toEqual(expected);
  });

  it('deleteNode(): deletes node and doesnt change selected node when not needed', () => {
    const payload = { network: 'Ethereum' as NetworkId, nodeName: 'eth_mycrypto' };
    const state = [{ ...fNetworks[0], selectedNode: 'eth_ethscan' }];
    const expected = [
      {
        ...fNetworks[0],
        nodes: [fNetworks[0].nodes[1]],
        selectedNode: 'eth_ethscan'
      }
    ];
    const actual = reducer(state, deleteNode(payload));
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { id: 'Rinkeby', name: 'Rink' } as Network;
    const state = [entity];
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });

  it('canDeleteNode(): returns false when you shouldnt be able to delete the network/node', () => {
    const networkId = 'MyNetwork' as NetworkId;
    const network = {
      id: networkId,
      name: 'MyNetwork',
      isCustom: true,
      nodes: [fNetwork.nodes[0]]
    } as Network;
    const state = ({
      legacy: {
        networks: [network],
        accounts: [{ ...fAccount, networkId }],
        addressBook: [{ network: networkId }],
        contracts: [{ networkId }]
      }
    } as unknown) as AppState;
    const actual = canDeleteNode(networkId)(state);
    expect(actual).toEqual(false);
  });

  it('canDeleteNode(): returns true when you should be able to delete', () => {
    const networkId = 'MyNetwork' as NetworkId;
    const network = {
      id: networkId,
      name: 'MyNetwork',
      isCustom: true,
      nodes: [fNetwork.nodes[0]]
    } as Network;
    const state = ({
      legacy: {
        networks: [network],
        accounts: fAccounts,
        addressBook: fContacts,
        contracts: fContracts
      }
    } as unknown) as AppState;
    const actual = canDeleteNode(networkId)(state);
    expect(actual).toEqual(true);
  });
});

describe('deleteNodeWorker()', () => {
  const initialState = {
    legacy: { networks: fNetworks }
  };

  it('calls updateEthersInstance with latest network', () => {
    const payload = { network: 'Ethereum' as NetworkId, nodeName: 'MyNode' };
    return expectSaga(deleteNodeWorker, deleteNode(payload))
      .withState(initialState)
      .call(EthersJS.updateEthersInstance, fNetworks[0])
      .silentRun();
  });
});

describe('deleteNodeOrNetworkWorker()', () => {
  const initialState = {
    legacy: { networks: [{ ...fNetworks[0], isCustom: true, nodes: [{ name: 'MyNode' }] }] }
  };

  it('can delete network if only one node', () => {
    return expectSaga(
      deleteNodeOrNetworkWorker,
      deleteNode({ network: 'Ethereum', nodeName: 'MyNode' })
    )
      .withState(initialState)
      .put(destroy(fNetworks[0].id))
      .silentRun();
  });

  it('can delete node if multiple nodes', () => {
    return expectSaga(
      deleteNodeOrNetworkWorker,
      deleteNode({ network: 'Ethereum', nodeName: 'MyNode' })
    )
      .withState({
        legacy: {
          networks: [{ ...fNetworks[0], nodes: [...fNetworks[0].nodes, { name: 'MyNode' }] }]
        }
      })
      .put(deleteNode({ network: fNetworks[0].id, nodeName: 'MyNode' }))
      .silentRun();
  });
});
