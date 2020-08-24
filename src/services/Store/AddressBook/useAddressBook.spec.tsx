import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { fAddressBook } from '@fixtures';
import { LSKeys, TUuid, ExtendedAddressBook, TAddress } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useAddressBook from './useAddressBook';

const renderUseAddressBook = ({
  addressBook = [] as ExtendedAddressBook[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ addressBook, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useAddressBook(), { wrapper });
};

describe('useAddressBook', () => {
  it('uses get addressbook from DataContext ', () => {
    const { result } = renderUseAddressBook({ addressBook: fAddressBook });
    expect(result.current.addressBook).toEqual(fAddressBook);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseAddressBook({ createActions });
    expect(createActions).toBeCalledWith(LSKeys.ADDRESS_BOOK);
  });

  it('createAddressBooks() calls model.create', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseAddressBook({
      addressBook: [],
      createActions: jest.fn(() => ({ create: mockCreate }))
    });
    result.current.createAddressBooks(fAddressBook[0]);
    expect(mockCreate).toBeCalledWith(fAddressBook[0]);
  });

  it('createAddressBooksWithID() calls model.createWithId', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseAddressBook({
      addressBook: [],
      createActions: jest.fn(() => ({ createWithID: mockCreate }))
    });
    result.current.createAddressBooksWithID('uuid' as TUuid, fAddressBook[0]);
    expect(mockCreate).toBeCalledWith(fAddressBook[0], 'uuid');
  });

  it('updateAddressBooks() calls model.update', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAddressBook({
      addressBook: fAddressBook,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.updateAddressBooks(fAddressBook[0].uuid, {
      ...fAddressBook[0],
      label: 'My new label'
    });
    expect(mockUpdate).toBeCalledWith(fAddressBook[0].uuid, {
      ...fAddressBook[0],
      label: 'My new label'
    });
  });

  it('deleteAddressBooks() calls model.destroy', () => {
    const mockDestroy = jest.fn();
    const { result } = renderUseAddressBook({
      addressBook: fAddressBook,
      createActions: jest.fn(() => ({ destroy: mockDestroy }))
    });
    act(() => {
      result.current.deleteAddressBooks(fAddressBook[0].uuid);
    });
    expect(mockDestroy).toBeCalledWith(fAddressBook[0]);
  });

  it('getContactByAddress()', () => {
    const { result } = renderUseAddressBook({
      addressBook: fAddressBook,
      createActions: jest.fn()
    });
    expect(result.current.getContactByAddress(fAddressBook[0].address as TAddress)).toBe(
      fAddressBook[0]
    );
  });

  it('getContactByAddressAndNetworkId()', () => {
    const { result } = renderUseAddressBook({
      addressBook: fAddressBook,
      createActions: jest.fn()
    });
    expect(
      result.current.getContactByAddressAndNetworkId(
        fAddressBook[1].address as TAddress,
        fAddressBook[1].network
      )
    ).toBe(fAddressBook[1]);
  });

  it('getAccountLabel()', () => {
    const { result } = renderUseAddressBook({
      addressBook: fAddressBook,
      createActions: jest.fn()
    });
    expect(
      result.current.getAccountLabel({
        address: fAddressBook[1].address as TAddress,
        networkId: fAddressBook[1].network
      })
    ).toBe(fAddressBook[1].label);
  });

  it('restoreDeletedAddressBook() calls model.createWithID', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseAddressBook({
      addressBook: fAddressBook,
      createActions: jest.fn(() => ({ createWithID: mockCreate }))
    });
    act(() => {
      result.current.deleteAddressBooks(fAddressBook[0].uuid);
    });
    expect(result.current.addressBook.length).toBe(1);
    act(() => {
      result.current.restoreDeletedAddressBook(fAddressBook[0].uuid);
    });
    expect(mockCreate).toBeCalledWith(fAddressBook[0], fAddressBook[0].uuid);
  });
});
