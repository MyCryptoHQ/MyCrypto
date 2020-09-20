import React from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { DEFAULT_NETWORK } from '@config';
import { contacts as seedContacts } from '@database/seed/contacts';
import { DataContext } from '@services/Store';
import { translateRaw } from '@translations';
import { ExtendedContact, TAddress, TUuid } from '@types';
import { noOp } from '@utils';

import EditableAccountLabel, { Props } from '../EditableAccountLabel';

const defaultProps: Props = {
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  networkId: DEFAULT_NETWORK,
  addressBookEntry: undefined,
  createContact: noOp,
  updateContact: noOp
};

const mockMappedContacts: ExtendedContact[] = Object.entries(seedContacts).map(([key, value]) => ({
  ...value,
  uuid: key as TUuid
}));

function getComponent(contacts: ExtendedContact[], props: Props) {
  return simpleRender(
    <DataContext.Provider
      value={
        ({
          addressBook: contacts,
          contracts: [],
          createActions: jest.fn()
        } as unknown) as any
      }
    >
      <EditableAccountLabel
        {...props}
        createContact={(c) => contacts.push({ ...c, uuid: 'uuid' as TUuid })}
      />
    </DataContext.Provider>
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
    await waitFor(() => fireEvent.keyDown(input, enter));
    expect(mockMappedContacts).toHaveLength(initialContactsLength + 1);
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
