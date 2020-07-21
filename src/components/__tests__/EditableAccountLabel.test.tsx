import React from 'react';
import { simpleRender, fireEvent, wait } from 'test-utils';

import { translateRaw } from '@translations';
import { DEFAULT_NETWORK } from '@config';
import { AddressBookContext } from '@services/Store';
import { ExtendedAddressBook, TUuid, TAddress } from '@types';
import { addressBook } from '@database/seed/addressBook';
import { isSameAddress } from '@utils';

import EditableAccountLabel, { Props } from '../EditableAccountLabel';

const defaultProps: Props = {
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  networkId: DEFAULT_NETWORK,
  addressBookEntry: undefined
};

const mockMappedContacts: ExtendedAddressBook[] = Object.entries(addressBook).map(
  ([key, value]) => ({
    ...value,
    uuid: key as TUuid
  })
);

function getComponent(contacts: ExtendedAddressBook[], props: Props) {
  return simpleRender(
    <AddressBookContext.Provider
      value={
        ({
          addressBook: contacts,
          getContactByAddress: (address: string) =>
            contacts.find((x: ExtendedAddressBook) =>
              isSameAddress(x.address as TAddress, address as TAddress)
            ),
          createAddressBooks: (contact: ExtendedAddressBook) => contacts.push(contact)
        } as unknown) as any
      }
    >
      <EditableAccountLabel {...props} />
    </AddressBookContext.Provider>
  );
}

const enter = { key: 'Enter', keyCode: 13 };

describe('EditableAccountLabel', () => {
  test('it enters edit mode when clicked and can be cancelled with escape', async () => {
    const { getByText, container } = getComponent(mockMappedContacts, defaultProps);
    const text = getByText(translateRaw('NO_LABEL'));
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(getByText(translateRaw('NO_LABEL'))).toBeDefined();
  });

  test('it enters edit mode when clicked and new address book input can be saved with enter', async () => {
    const { getByText, container } = getComponent(mockMappedContacts, defaultProps);
    const text = getByText(translateRaw('NO_LABEL'));
    const initialContactsLength = mockMappedContacts.length;
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    const inputString = 'eth.eth';
    expect(input).toBeDefined();
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: inputString } });
    await wait(() => fireEvent.keyDown(input, enter));
    expect(mockMappedContacts.length).toBe(initialContactsLength + 1);
  });

  test('it enters edit mode when clicked and exits when focus lost', async () => {
    const { getByText, container } = getComponent(mockMappedContacts, defaultProps);
    const text = getByText(translateRaw('NO_LABEL'));
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    fireEvent.blur(input);
    expect(getByText(translateRaw('NO_LABEL'))).toBeDefined();
  });
});
