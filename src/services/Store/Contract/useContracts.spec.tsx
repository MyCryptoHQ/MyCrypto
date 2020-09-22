import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { fContracts } from '@fixtures';
import { ExtendedContract, LSKeys, TAddress, TUuid } from '@types';
import { innerJoin, map, omit, pipe, prop, slice, sort } from '@vendor';

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
  it('uses get contracts from DataContext', () => {
    const { result } = renderUseContract();
    expect(result.current.contracts).toEqual([]);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseContract({ createActions });
    expect(createActions).toHaveBeenCalledWith(LSKeys.CONTRACTS);
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
    const createActions = jest.fn().mockReturnValue({
      create: jest.fn()
    });
    const target = fContracts[0];
    const { result } = renderUseContract({ createActions });
    // Remove the uuid from fixture since we expect Contract
    result.current.createContract(omit(['uuid'], target));
    // Since uuid are deterministic we can asset that it will be the same
    // as the fixture.
    expect(createActions().create).toHaveBeenCalledWith(target);
  });

  it('createContract(): returns the contract with the generated uuid', () => {
    const createActions = jest.fn().mockReturnValue({
      create: jest.fn()
    });
    const target = fContracts[0];
    const { result } = renderUseContract({ createActions });

    const res = result.current.createContract(omit(['uuid'], target));
    expect(res.uuid).toEqual(target.uuid);
  });

  it('deleteContract(): calls destroy() with the target contract', () => {
    const createActions = jest.fn().mockReturnValue({
      destroy: jest.fn()
    });
    const target = fContracts[0];
    const { result } = renderUseContract({ contracts: [target], createActions });

    result.current.deleteContract(target.uuid);
    expect(createActions().destroy).toHaveBeenCalledWith(target);
  });
});
