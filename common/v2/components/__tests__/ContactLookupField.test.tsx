import React from 'react';
import { simpleRender, fireEvent, wait } from 'test-utils';
import { fNetwork } from 'fixtures';

import { AddressBookContext } from 'v2/services/Store';
import { AddressBook, ExtendedAddressBook, TUuid, IReceiverAddress } from 'v2/types';
import { addressBook } from 'v2/database/seed/addressBook';

import ContactLookupField from '../ContactLookupField';

interface ParamsProps {
  error?: string;
  handleDomainResolve?(domain: string): string;
}

const getDefaultProps = ({ handleDomainResolve, error }: ParamsProps = {} as ParamsProps) => {
  const props = {
    network: fNetwork,
    isValidAddress: false,
    isResolvingName: false,
    onBlur: jest.fn(),
    fieldProps: {
      field: { name: 'address', value: { value: '', display: '' } },
      form: {
        setFieldValue: (_: any, fieldValue: IReceiverAddress) =>
          (props.fieldProps.field.value = fieldValue),
        setFieldTouched: jest.fn()
      }
    },
    clearErrors: jest.fn(),
    resolutionError: undefined,
    handleDomainResolve: handleDomainResolve || jest.fn(),
    error
  };

  return props;
};

function getComponent(props: any, contacts: AddressBook[] = []) {
  return simpleRender(
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
      <ContactLookupField {...props} />
    </AddressBookContext.Provider>
  );
}

const enter = { key: 'Enter', keyCode: 13 };
const mappedContacts: ExtendedAddressBook[] = Object.entries(addressBook).map(([key, value]) => ({
  ...value,
  uuid: key as TUuid
}));

describe('ContactLookupField', () => {
  test('it renders the placeholder when no value', async () => {
    const { getByText } = getComponent(getDefaultProps());
    const selector = 'Enter an Address or Contact';
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('it adds unknown address to contact book and select it after blur', async () => {
    const address = mappedContacts[0].address;
    const contacts: ExtendedAddressBook[] = [];
    const props = getDefaultProps();
    const { container } = getComponent(props, contacts);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: address } });
    fireEvent.blur(input!);

    expect(contacts.length).toBe(1);
    expect(props.fieldProps.field.value.value).toBe(address);
    expect(props.fieldProps.field.value.display).toBe(contacts[0].label);
  });

  test('it adds unknown ens to contact book and select it by keypress enter', async () => {
    const contacts: ExtendedAddressBook[] = [];
    const address = mappedContacts[0].address;
    const ens = 'eth.eth';
    const handleDomainResolve = () => address;
    const props = getDefaultProps({ handleDomainResolve });
    const { container } = getComponent(props, contacts);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: ens } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(contacts.length).toBe(1);
    expect(props.fieldProps.field.value.value).toBe(address);
    expect(props.fieldProps.field.value.display).toBe(ens.split('.')[0]);
  });

  test('it select unresolved input and not add it into contacts book', async () => {
    const contacts: ExtendedAddressBook[] = [];
    const inputString = '0x1234';
    const props = getDefaultProps();
    const { container } = getComponent(props, contacts);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    fireEvent.blur(input!);

    expect(contacts.length).toBe(0);
    expect(props.fieldProps.field.value.value).toBe(inputString);
    expect(props.fieldProps.field.value.display).toBe(inputString);
  });

  test('it select existing contact from contacts book by keypress enter', async () => {
    const contacts: ExtendedAddressBook[] = mappedContacts.map(x => x);
    const [contact] = contacts;
    const handleDomainResolve = () => contact.address;
    const inputString = 'eth.eth';
    const props = getDefaultProps({ handleDomainResolve });
    const { container } = getComponent(props, contacts);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(contacts.length).toBe(2);
    expect(props.fieldProps.field.value).toStrictEqual({
      display: contact.label,
      value: contact.address
    });
  });

  test('it renders inline error in case of error', async () => {
    const error = 'Error resolving ens';
    const props = getDefaultProps({ error });
    const { getByText } = getComponent(props);
    expect(getByText(error)).toBeDefined();
  });
});
