import React from 'react';
import { Form, Formik } from 'formik';
import { simpleRender, fireEvent, wait } from 'test-utils';
import { fNetwork } from '@fixtures';

import { AddressBookContext, AssetContext } from 'v2/services/Store';
import { AddressBook, ExtendedAddressBook, TUuid, IReceiverAddress } from 'v2/types';
import { addressBook } from 'v2/database/seed/addressBook';

import ContactLookupField from '../ContactLookupField';

interface FormValues {
  data: {
    address?: IReceiverAddress;
  };
}

const getDefaultProps = (error?: string) => ({
  network: fNetwork,
  isValidAddress: false,
  isResolvingName: false,
  error,
  setIsResolvingDomain: jest.fn(),
  name: 'address'
});

const initialFormikValues: { address: IReceiverAddress } = {
  address: {
    display: '',
    value: ''
  }
};

function getComponent(props: any, contacts: AddressBook[] = [], output: FormValues = { data: {} }) {
  const mapFormValues = (values: { address: IReceiverAddress }) => {
    output.data = values;
  };

  return simpleRender(
    <AssetContext.Provider
      value={
        ({
          assets: [{ uuid: fNetwork.baseAsset }]
        } as unknown) as any
      }
    >
      <AddressBookContext.Provider
        value={
          ({
            addressBook: contacts,
            getContactByAddress: (address: string) =>
              contacts.find((x: ExtendedAddressBook) => x.address === address),
            createAddressBooks: (contact: AddressBook) => contacts.push(contact)
          } as unknown) as any
        }
      >
        <Formik
          validate={mapFormValues}
          initialValues={initialFormikValues}
          onSubmit={jest.fn()}
          render={({ values }) => (
            <Form>
              <ContactLookupField {...props} value={values.address} />
            </Form>
          )}
        />
      </AddressBookContext.Provider>
    </AssetContext.Provider>
  );
}

const enter = { key: 'Enter', keyCode: 13 };
const mockMappedContacts: ExtendedAddressBook[] = Object.entries(addressBook).map(
  ([key, value]) => ({
    ...value,
    uuid: key as TUuid
  })
);

// mock domain resolving function
jest.mock('v2/services/UnstoppableService', () => ({
  getResolvedAddress: () => mockMappedContacts[0].address
}));

describe('ContactLookupField', () => {
  test('it renders the placeholder when no value', async () => {
    const { getByText } = getComponent(getDefaultProps());
    const selector = 'Enter an Address or Contact';
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('it adds unknown address to contact book and select it after blur', async () => {
    const address = mockMappedContacts[0].address;
    const contacts: ExtendedAddressBook[] = [];
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: address } });
    fireEvent.blur(input!);

    expect(contacts.length).toBe(1);
    expect(output.data.address.value).toBe(address);
    expect(output.data.address.display).toBe(contacts[0].label);
  });

  test('it adds unknown ens to contact book and select it by keypress enter', async () => {
    const contacts: ExtendedAddressBook[] = [];
    const address = mockMappedContacts[0].address;
    const ens = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: ens } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(contacts.length).toBe(1);
    expect(output.data.address.value).toBe(address);
    expect(output.data.address.display).toBe(ens.split('.')[0]);
  });

  test('it select unresolved input and not add it into contacts book', async () => {
    const contacts: ExtendedAddressBook[] = [];
    const inputString = '0x1234';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    fireEvent.blur(input!);

    expect(contacts.length).toBe(0);
    expect(output.data.address.value).toBe(inputString);
    expect(output.data.address.display).toBe(inputString);
  });

  test('it select existing contact from contacts book by keypress enter', async () => {
    const contacts: ExtendedAddressBook[] = mockMappedContacts.map(x => x);
    const [contact] = contacts;
    const inputString = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(contacts.length).toBe(2);
    expect(output.data.address).toStrictEqual({
      display: contact.label,
      value: contact.address
    });
  });

  test('it renders inline error in case of error', async () => {
    const error = 'Error resolving ens';
    const props = getDefaultProps(error);
    const { getByText } = getComponent(props);
    expect(getByText(error)).toBeDefined();
  });
});
