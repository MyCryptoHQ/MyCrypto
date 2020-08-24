import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { fNetwork, fNetworks, customNodeConfig } from '@fixtures';
import { LSKeys, Network } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useNetworks from './useNetworks';

const renderUseNetworks = ({ networks = [] as Network[], createActions = jest.fn() } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ networks, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useNetworks(), { wrapper });
};

describe('useNetworks', () => {
  it('uses get networks from DataContext ', () => {
    const { result } = renderUseNetworks({ networks: [fNetwork] });
    expect(result.current.networks).toEqual([fNetwork]);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseNetworks({ createActions });
    expect(createActions).toBeCalledWith(LSKeys.NETWORKS);
  });

  it('addNetwork() calls model.create', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseNetworks({
      networks: [],
      createActions: jest.fn(() => ({ create: mockCreate }))
    });
    result.current.addNetwork(fNetworks[0]);
    expect(mockCreate).toBeCalledWith(fNetworks[0]);
  });

  it('updateNetwork() calls model.update', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseNetworks({
      networks: [],
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.updateNetwork(fNetworks[0].id, fNetworks[0]);
    expect(mockUpdate).toBeCalledWith(fNetworks[0].id, fNetworks[0]);
  });

  it('getNetworkById() finds network with id', () => {
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn()
    });
    expect(result.current.getNetworkById(fNetworks[0].id)).toBe(fNetworks[0]);
  });

  it('getNetworkByChainId() finds network with chain id', () => {
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn()
    });
    expect(result.current.getNetworkByChainId(fNetworks[0].chainId)).toBe(fNetworks[0]);
  });

  it('getNetworkNodes() finds network nodes for network id', () => {
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn()
    });
    expect(result.current.getNetworkNodes(fNetworks[0].id)).toBe(fNetworks[0].nodes);
  });

  it('addNodeToNetwork() adds node to network', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn(() => ({
        update: mockUpdate
      }))
    });
    result.current.addNodeToNetwork(customNodeConfig, fNetwork.id);
    expect(mockUpdate).toBeCalledWith(fNetwork.id, {
      ...fNetwork,
      nodes: [...fNetwork.nodes, customNodeConfig],
      selectedNode: customNodeConfig.name
    });
  });

  it('updateNode() adds node to network', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn(() => ({
        update: mockUpdate
      }))
    });
    result.current.updateNode(customNodeConfig, fNetworks[0].id, fNetworks[0].nodes[0].name);
    expect(mockUpdate).toBeCalledWith(fNetworks[0].id, {
      ...fNetworks[0],
      nodes: [fNetworks[0].nodes[1], customNodeConfig],
      selectedNode: customNodeConfig.name
    });
  });

  it('deleteNode() deletes node from network', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn(() => ({
        update: mockUpdate
      }))
    });
    result.current.deleteNode(fNetworks[0].nodes[0].name, fNetworks[0].id);
    expect(mockUpdate).toBeCalledWith(fNetworks[0].id, {
      ...fNetworks[0],
      nodes: [fNetworks[0].nodes[1]],
      selectedNode: fNetworks[0].nodes[1].name
    });
  });

  it('setNetworkSelectedNode() sets the network property selectedNode', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn(() => ({
        update: mockUpdate
      }))
    });
    result.current.setNetworkSelectedNode(fNetworks[0].id, fNetworks[0].nodes[1].name);
    expect(mockUpdate).toBeCalledWith(fNetworks[0].id, {
      ...fNetworks[0],
      selectedNode: fNetworks[0].nodes[1].name
    });
  });

  it('isNodeNameAvailable() detects availability of node names', () => {
    const { result } = renderUseNetworks({
      networks: fNetworks,
      createActions: jest.fn()
    });
    expect(result.current.isNodeNameAvailable(fNetwork.id, 'infura')).toBe(false);
    expect(result.current.isNodeNameAvailable(fNetwork.id, 'mycustomnode')).toBe(true);
  });
});
