import { FC } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { customNodeConfig, fNetwork, fNetworks } from '@fixtures';
import { Network } from '@types';

import useNetworks from './useNetworks';

const renderUseNetworks = ({ networks = [] as Network[] } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ networks })}>{children}</ProvidersWrapper>
  );
  return renderHook(() => useNetworks(), { wrapper });
};

describe('useNetworks', () => {
  it('uses get networks from store', () => {
    const { result } = renderUseNetworks({ networks: [fNetwork] });
    expect(result.current.networks).toEqual([fNetwork]);
  });

  it('addNetwork() calls create', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: [] });
    result.current.addNetwork(fNetworks[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fNetworks[0]));
  });

  it('updateNetwork() calls update', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: [] });
    result.current.updateNetwork(fNetworks[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fNetworks[0]));
  });

  it('deleteNetwork() calls destroy', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: fNetworks });
    result.current.deleteNetwork('Ropsten');
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload('Ropsten'));
  });

  it('getNetworkById() finds network with id', () => {
    const { result } = renderUseNetworks({ networks: fNetworks });
    expect(result.current.getNetworkById(fNetworks[0].id)).toBe(fNetworks[0]);
  });

  it('getNetworkByChainId() finds network with chain id', () => {
    const { result } = renderUseNetworks({ networks: fNetworks });
    expect(result.current.getNetworkByChainId(fNetworks[0].chainId)).toBe(fNetworks[0]);
  });

  it('getNetworkNodes() finds network nodes for network id', () => {
    const { result } = renderUseNetworks({ networks: fNetworks });
    expect(result.current.getNetworkNodes(fNetworks[0].id)).toBe(fNetworks[0].nodes);
  });

  it('addNodeToNetwork() adds node to network', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: fNetworks });
    result.current.addNodeToNetwork(customNodeConfig, fNetwork.id);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...fNetwork,
        nodes: [...fNetwork.nodes, customNodeConfig],
        selectedNode: customNodeConfig.name
      })
    );
  });

  it('updateNode() adds node to network', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: fNetworks });
    result.current.updateNode(customNodeConfig, fNetworks[0].id, fNetworks[0].nodes[0].name);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...fNetworks[0],
        nodes: [fNetworks[0].nodes[1], customNodeConfig],
        selectedNode: customNodeConfig.name
      })
    );
  });

  it('deleteNode() dispatches deleteNode', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: fNetworks });
    result.current.deleteNode(fNetworks[0].nodes[0].name, fNetworks[0].id);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        network: fNetworks[0].id,
        nodeName: fNetworks[0].nodes[0].name
      })
    );
  });

  it('setNetworkSelectedNode() sets the network property selectedNode', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNetworks({ networks: fNetworks });
    result.current.setNetworkSelectedNode(fNetworks[0].id, fNetworks[0].nodes[1].name);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...fNetworks[0],
        selectedNode: fNetworks[0].nodes[1].name
      })
    );
  });

  it('isNodeNameAvailable() detects availability of node names', () => {
    const { result } = renderUseNetworks({ networks: fNetworks });
    expect(result.current.isNodeNameAvailable(fNetwork.id, 'infura')).toBe(false);
    expect(result.current.isNodeNameAvailable(fNetwork.id, 'mycustomnode')).toBe(true);
  });
});
