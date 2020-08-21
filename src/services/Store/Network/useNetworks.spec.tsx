import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { fNetwork, fNetworks } from '@fixtures';
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

  it('uses get networks from DataContext ', () => {
    const { result } = renderUseNetworks({ networks: [fNetwork] });
    expect(result.current.networks).toEqual([fNetwork]);
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

  // TODO: MORE TESTS
});
