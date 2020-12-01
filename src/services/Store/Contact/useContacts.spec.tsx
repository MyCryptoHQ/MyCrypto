import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fContacts } from '@fixtures';
import { ExtendedContact, TAddress } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useContacts from './useContacts';

const renderUseContacts = ({
  contacts = [] as ExtendedContact[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <ProvidersWrapper>
      <DataContext.Provider
        value={({ addressBook: contacts, createActions } as any) as IDataContext}
      >
        {' '}
        {children}
      </DataContext.Provider>
    </ProvidersWrapper>
  );
  return renderHook(() => useContacts(), { wrapper });
};

describe('useContacts', () => {
  it('uses get addressbook from DataContext', () => {
    const { result } = renderUseContacts({ contacts: fContacts });
    expect(result.current.contacts).toEqual(fContacts);
  });

  it('createContact() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseContacts({
      contacts: fContacts
    });
    result.current.createContact(fContacts[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fContacts[0]));
  });

  it('updateContact() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseContacts({
      contacts: fContacts
    });
    result.current.updateContact({
      ...fContacts[0],
      label: 'My new label'
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...fContacts[0],
        label: 'My new label'
      })
    );
  });

  it('deleteContact() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseContacts({
      contacts: fContacts
    });
    result.current.deleteContact(fContacts[0].uuid);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fContacts[0].uuid));
  });

  it('getContactByAddress()', () => {
    const { result } = renderUseContacts({
      contacts: fContacts
    });
    expect(result.current.getContactByAddress(fContacts[0].address as TAddress)).toBe(fContacts[0]);
  });

  it('getContactByAddressAndNetworkId()', () => {
    const { result } = renderUseContacts({
      contacts: fContacts
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
      contacts: fContacts
    });
    expect(
      result.current.getAccountLabel({
        address: fContacts[1].address as TAddress,
        networkId: fContacts[1].network
      })
    ).toBe(fContacts[1].label);
  });

  it('restoreDeletedContact() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseContacts({
      contacts: fContacts
    });
    act(() => {
      result.current.deleteContact(fContacts[0].uuid);
    });
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fContacts[0].uuid));
    act(() => {
      result.current.restoreDeletedContact(fContacts[0].uuid);
    });
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fContacts[0].uuid));
  });
});
