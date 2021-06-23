import { FC } from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fContacts } from '@fixtures';
import { ExtendedContact, LSKeys, TAddress } from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import useContacts from './useContacts';

const renderUseContacts = ({ contacts = [] as ExtendedContact[] } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ [LSKeys.ADDRESS_BOOK]: contacts })}>
      {children}
    </ProvidersWrapper>
  );
  return renderHook(() => useContacts(), { wrapper });
};

describe('useContacts', () => {
  it('uses get addressbook from store', () => {
    const { result } = renderUseContacts({ contacts: fContacts });
    expect(result.current.contacts).toEqual(fContacts);
  });

  it('createContact() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseContacts({
      contacts: fContacts
    });
    const { uuid, ...contact } = fContacts[0];
    result.current.createContact(contact);
    const newUuid = generateDeterministicAddressUUID(contact.network, contact.address);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload({ ...contact, uuid: newUuid }));
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
    act(() => {
      result.current.deleteContact(fContacts[0].uuid);
    });
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
