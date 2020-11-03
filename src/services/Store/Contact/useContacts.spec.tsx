import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line import/no-namespace
import * as ReactRedux from 'react-redux';
import { Provider } from 'react-redux';

import { fContacts } from '@fixtures';
import { store } from '@store';
import { ExtendedContact, TAddress } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useContacts from './useContacts';

const getUseDispatchMock = () => {
  const mockDispatch = jest.fn();
  jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  return mockDispatch;
};

const renderUseContacts = ({ contacts = [] as ExtendedContact[] } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <DataContext.Provider
        value={({ addressBook: contacts, createActions: jest.fn() } as any) as IDataContext}
      >
        {' '}
        {children}
      </DataContext.Provider>
    </Provider>
  );
  return renderHook(() => useContacts(), { wrapper });
};

describe('useContacts', () => {
  it('uses get addressbook from DataContext', () => {
    const { result } = renderUseContacts({ contacts: fContacts });
    expect(result.current.contacts).toEqual(fContacts);
  });

  it('createContact() dispatchs create action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseContacts({ contacts: [] });
    result.current.createContact(fContacts[0]);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: fContacts[0] }));
  });

  it('createContact() dispatchs create action with uuid when not provider', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseContacts({ contacts: [] });
    const { uuid, ...withoutUUID } = fContacts[0];
    result.current.createContact(withoutUUID);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining(withoutUUID)
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.objectContaining({ uuid: expect.any(String) }) })
    );
  });

  it('updateContact() dispatchs update action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseContacts({ contacts: fContacts });
    result.current.updateContact(fContacts[0].uuid, {
      ...fContacts[0],
      label: 'My new label'
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          ...fContacts[0],
          label: 'My new label'
        }
      })
    );
  });

  it('deleteContact() dispatchs destroy action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseContacts({ contacts: fContacts });
    act(() => {
      result.current.deleteContact(fContacts[0].uuid);
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: fContacts[0].uuid })
    );
  });

  it('getContactByAddress()', () => {
    const { result } = renderUseContacts({ contacts: fContacts });
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
    const { result } = renderUseContacts({ contacts: fContacts });
    expect(
      result.current.getAccountLabel({
        address: fContacts[1].address as TAddress,
        networkId: fContacts[1].network
      })
    ).toBe(fContacts[1].label);
  });

  it('restoreDeletedContact() dispatchs create action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseContacts({ contacts: fContacts });
    act(() => {
      result.current.deleteContact(fContacts[0].uuid);
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: fContacts[0].uuid })
    );

    act(() => {
      result.current.restoreDeletedContact(fContacts[0].uuid);
    });
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: fContacts[0] }));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });
});
