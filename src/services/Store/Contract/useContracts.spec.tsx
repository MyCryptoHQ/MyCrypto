import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line import/no-namespace
import * as ReactRedux from 'react-redux';
import { Provider } from 'react-redux';

import { fContracts } from '@fixtures';
import { store } from '@store';
import { ExtendedContract, TAddress, TUuid } from '@types';
import { innerJoin, map, omit, pipe, prop, slice, sort } from '@vendor';

import { DataContext, IDataContext } from '../DataManager';
import useContracts from './useContracts';

const getUseDispatchMock = () => {
  const mockDispatch = jest.fn();
  jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  return mockDispatch;
};

const renderUseContract = ({ contracts = [] as ExtendedContract[] } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <DataContext.Provider value={({ contracts } as any) as IDataContext}>
        {' '}
        {children}
      </DataContext.Provider>
    </Provider>
  );
  return renderHook(() => useContracts(), { wrapper });
};

describe('useContract', () => {
  it('uses get contracts from DataContext', () => {
    const { result } = renderUseContract();
    expect(result.current.contracts).toEqual([]);
  });

  it('getContractsByIds(): can filter contracts by a list of uuids', () => {
    const { result } = renderUseContract({
      contracts: slice(0, 9, fContracts)
    });
    const uuids = [
      '293baed2-5548-59dc-9f57-a15c0fb3e967',
      '9f5ea8d2-03bb-5acf-8d76-f769c0b2d3c3'
    ] as TUuid[];
    // Sort so we can compare arrays
    const sortByName = pipe(
      map(prop('name')),
      sort((a: string, b: string) => a.localeCompare(b))
    );
    const received = sortByName(result.current.getContractsByIds(uuids));
    const expected = sortByName(
      innerJoin((contract, uuid) => contract.uuid === uuid, fContracts, uuids)
    );

    expect(received).toEqual(expected);
  });

  it('getContractByAddress(): can find a contract by address', () => {
    const { result } = renderUseContract({
      contracts: slice(0, 9, fContracts)
    });
    const contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d' as TAddress;
    const received = result.current.getContractByAddress(contractAddress);

    expect(received?.address).toEqual(contractAddress);
  });

  it('createContract(): adds the uuid and calls create()', () => {
    const mockDispatch = getUseDispatchMock();

    const target = fContracts[0];
    const { result } = renderUseContract();
    // Remove the uuid from fixture since we expect Contract
    result.current.createContract(omit(['uuid'], target));
    // Since uuid are deterministic we can asset that it will be the same
    // as the fixture.
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: target }));
  });

  it('createContract(): returns the contract with the generated uuid', () => {
    const target = fContracts[0];
    const { result } = renderUseContract();

    const res = result.current.createContract(omit(['uuid'], target));
    expect(res.uuid).toEqual(target.uuid);
  });

  it('deleteContract(): calls destroy() with the target contract', () => {
    const mockDispatch = getUseDispatchMock();
    const target = fContracts[0];
    const { result } = renderUseContract({ contracts: [target] });

    result.current.deleteContract(target.uuid);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: target.uuid }));
  });
});
