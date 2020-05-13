import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { innerJoin, slice, prop, map, sort, pipe } from 'ramda';

import { fContracts } from '@fixtures';
import { TAddress, LSKeys, ExtendedContract, TUuid } from '@types';
import { DataContext, IDataContext } from '../DataManager';
import useContracts from './useContracts';

const renderUseContract = ({
  contracts = [] as ExtendedContract[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ contracts, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useContracts(), { wrapper });
};

describe('useContract', () => {
  it('uses get contracts from DataContext ', () => {
    const { result } = renderUseContract();
    expect(result.current.contracts).toEqual([]);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseContract({ createActions });
    expect(createActions).toBeCalledWith(LSKeys.CONTRACTS);
  });

  it('getContractNames(): can filter contracts by a list of uuids', () => {
    const { result } = renderUseContract({
      contracts: slice(0, 9, fContracts) as ExtendedContract[]
    });
    const uuids = [
      '293baed2-5548-59dc-9f57-a15c0fb3e967',
      '9f5ea8d2-03bb-5acf-8d76-f769c0b2d3c3'
    ] as TUuid[];
    const received = result.current.getContractsByIds(uuids);
    const expected = innerJoin((contract, uuid) => contract.uuid === uuid, fContracts, uuids);
    const getContractNames = pipe(
      map(prop('name')),
      sort((a: string, b: string) => a.localeCompare(b))
    );
    expect(getContractNames(received)).toEqual(getContractNames(expected));
  });

  it('getContractByAddress(): can find a contract by address', () => {
    const { result } = renderUseContract({
      contracts: slice(0, 9, fContracts) as ExtendedContract[]
    });
    const contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d' as TAddress;
    const received = result.current.getContractByAddress(contractAddress);

    expect(received?.address).toEqual(contractAddress);
  });
});
