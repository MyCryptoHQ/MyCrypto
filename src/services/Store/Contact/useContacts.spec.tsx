import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { fContacts } from '@fixtures';
import { LSKeys, TUuid, ExtendedContact, TAddress } from '@types';
import { omit } from '@vendor';

import { DataContext, IDataContext } from '../DataManager';
import useContacts from './useContacts';

const renderUseContacts = ({
  contacts = [] as ExtendedContact[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ addressBook: contacts, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useContacts(), { wrapper });
};

describe('useContacts', () => {
  it('uses get addressbook from DataContext ', () => {
    const { result } = renderUseContacts({ contacts: fContacts });
    expect(result.current.contacts).toEqual(fContacts);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseContacts({ createActions });
    expect(createActions).toBeCalledWith(LSKeys.ADDRESS_BOOK);
  });

  it('createContact() calls model.create', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseContacts({
      contacts: [],
      createActions: jest.fn(() => ({ create: mockCreate }))
    });
    result.current.createContact(fContacts[0]);
    expect(mockCreate).toBeCalledWith(expect.objectContaining(omit(['uuid'], fContacts[0])));
  });

  it('createContactWithID() calls model.createWithId', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseContacts({
      contacts: [],
      createActions: jest.fn(() => ({ createWithID: mockCreate }))
    });
    result.current.createContactWithID('uuid' as TUuid, fContacts[0]);
    expect(mockCreate).toBeCalledWith(fContacts[0], 'uuid');
  });

  it('updateContact() calls model.update', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseContacts({
      contacts: fContacts,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.updateContact(fContacts[0].uuid, {
      ...fContacts[0],
      label: 'My new label'
    });
    expect(mockUpdate).toBeCalledWith(fContacts[0].uuid, {
      ...fContacts[0],
      label: 'My new label'
    });
  });

  it('deleteContact() calls model.destroy', () => {
    const mockDestroy = jest.fn();
    const { result } = renderUseContacts({
      contacts: fContacts,
      createActions: jest.fn(() => ({ destroy: mockDestroy }))
    });
    act(() => {
      result.current.deleteContact(fContacts[0].uuid);
    });
    expect(mockDestroy).toBeCalledWith(fContacts[0]);
  });

  it('getContactByAddress()', () => {
    const { result } = renderUseContacts({
      contacts: fContacts,
      createActions: jest.fn()
    });
    expect(result.current.getContactByAddress(fContacts[0].address as TAddress)).toBe(fContacts[0]);
  });

  it('getContactByAddressAndNetworkId()', () => {
    const { result } = renderUseContacts({
      contacts: fContacts,
      createActions: jest.fn()
    });
    expect(
      result.current.getContactByAddressAndNetworkId(
        fContacts[1].address as TAddress,
        fContacts[1].network
      )
    ).toBe(fContacts[1]);
  });

  it('getAccountLabel()', () => {
    const { result } = renderUseContacts({
      contacts: fContacts,
      createActions: jest.fn()
    });
    expect(
      result.current.getAccountLabel({
        address: fContacts[1].address as TAddress,
        networkId: fContacts[1].network
      })
    ).toBe(fContacts[1].label);
  });

  it('restoreDeletedContact() calls model.createWithID', () => {
    const mockCreate = jest.fn();
    const mockDestroy = jest.fn();
    const { result } = renderUseContacts({
      contacts: fContacts,
      createActions: jest.fn(() => ({ createWithID: mockCreate, destroy: mockDestroy }))
    });
    act(() => {
      result.current.deleteContact(fContacts[0].uuid);
    });
    expect(mockDestroy).toBeCalledWith(fContacts[0]);
    act(() => {
      result.current.restoreDeletedContact(fContacts[0].uuid);
    });
    expect(mockCreate).toBeCalledWith(fContacts[0], fContacts[0].uuid);
  });
});
