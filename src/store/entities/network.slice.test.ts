import { NETWORKS } from '@database';
import { fNetwork, fNetworks } from '@fixtures';
import { Network, NetworkId, NodeOptions } from '@types';

import slice, { getNode, getNodes } from './network.slice';

const reducer = slice.reducer;
const { create, update, addNode, updateNode, deleteNode } = slice.actions;

describe('NetworkSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: 'dummyAction' });
    expect(Object.keys(actual)).toEqual([
      'Ethereum',
      'Ropsten',
      'Kovan',
      'Rinkeby',
      'Goerli',
      'ETC',
      'UBQ',
      'EXP',
      'POA',
      'TOMO',
      'MUSIC',
      'EGEM',
      'CLO',
      'RSK',
      'RSK_TESTNET',
      'GO',
      'GO_TESTNET',
      'ESN',
      'AQUA',
      'AKA',
      'PIRL',
      'ATH',
      'ETHO',
      'MIX',
      'REOSC',
      'ARTIS_SIGMA1',
      'ARTIS_TAU1',
      'THUNDERCORE',
      'WEB',
      'METADIUM',
      'DEXON',
      'ETI',
      'ASK',
      'AUX',
      'ERE',
      'VOLTA',
      'EnergyWebChain',
      'HARDLYDIFFICULT'
    ]);
  });
  it('create(): adds an entity by id', () => {
    const entity = { id: 'Ropsten' } as Network;
    const state = ({ Ethereum: { id: 'Ethereum' } } as unknown) as Record<NetworkId, Network>;
    const actual = reducer(state, create(entity));
    const expected = { ...state, [entity.id]: entity };
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { id: 'Ethereum', isCustom: false } as Network;
    const state = { [entity.id]: entity } as typeof NETWORKS;
    const modifiedEntity = { ...entity, address: '0x1' } as Network;
    const actual = reducer(state, update(modifiedEntity));
    const expected = { [entity.id]: modifiedEntity };
    expect(actual).toEqual(expected);
  });

  it('addNode(): adds a node to a network', () => {
    const node = { name: 'custom_node' } as NodeOptions;
    const initialState = { [fNetwork.id]: fNetwork } as typeof NETWORKS;
    const state = reducer(initialState, addNode({ node, networkId: fNetwork.id }));
    const actual = getNode(fNetwork.id, node.name)(state);
    expect(actual).toEqual(node);
  });

  it('updateNode(): adds a node to a network', () => {
    const node = { name: 'custom_node', isCustom: false } as NodeOptions;
    const initialState = { [fNetwork.id]: { ...fNetwork, nodes: [node] } } as typeof NETWORKS;
    const expected = { ...node, isCustom: true } as NodeOptions;
    const state = reducer(
      initialState,
      updateNode({ node: expected, networkId: fNetwork.id, nodeId: node.name })
    );
    const actual = getNode(fNetwork.id, node.name)(state);
    expect(actual).toEqual(expected);
  });

  it('deleteNode(): removes a node from network', () => {
    const initialState = { [fNetwork.id]: fNetworks[0] } as typeof NETWORKS;
    const state = reducer(
      initialState,
      deleteNode({ networkId: fNetwork.id, nodeId: 'ethereum_infura' })
    );
    const actual = getNodes(fNetwork.id)(state);
    expect(actual).toHaveLength(fNetworks[0].nodes.length - 1);
  });
});
