import React from 'react';

import {
  actionWithPayload,
  fireEvent,
  mockUseDispatch,
  ProvidersWrapper,
  simpleRender,
  waitFor
} from 'test-utils';

import { fContacts, fNetwork } from '@fixtures';
import { DataContext } from '@services/Store';
import { Contact, ExtendedContact, IReceiverAddress, TUuid } from '@types';
import { generateDeterministicAddressUUID } from '@utils';

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

function getComponent(
  props: any,
  contacts: Contact[] = [],
  output: FormValues = { data: { address: { value: '', display: '' } } }
) {
  const setFormValue = (address: IReceiverAddress) => {
    output.data = { address };
  };

  return simpleRender(
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: [{ uuid: fNetwork.baseAsset }],
            addressBook: contacts,
            contracts: []
          } as unknown) as any
        }
      >
        <ContactLookupField
          {...props}
          value={output.data.address}
          setFieldValue={(_, value) => setFormValue(value)}
        />
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

const enter = { key: 'Enter', keyCode: 13 };
const mockMappedContacts: ExtendedContact[] = Object.entries(fContacts).map(([key, value]) => ({
  ...value,
  uuid: key as TUuid
}));

// mock domain resolving function
jest.mock('@services/UnstoppableService', () => ({
  getResolvedAddress: () => mockMappedContacts[0].address
}));

describe('ContactLookupField', () => {
  test('it renders the placeholder when no value', async () => {
    const { getByText } = getComponent(getDefaultProps());
    const selector = 'Enter an Address or Contact';
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('it adds unknown address to contact book and select it after blur', async () => {
    const mockDispatch = mockUseDispatch();
    const address = mockMappedContacts[0].address;
    const contacts: ExtendedContact[] = [];
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: address } });
    fireEvent.blur(input!);
    const uuid = generateDeterministicAddressUUID('Ropsten', address);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        address,
        label: 'Recipient 1',
        network: 'Ropsten',
        notes: '',
        uuid
      })
    );
  });

  test('it adds unknown ens to contact book and select it by keypress enter', async () => {
    const mockDispatch = mockUseDispatch();
    const contacts: ExtendedContact[] = [];
    const address = mockMappedContacts[0].address;
    const ens = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: ens } });
    await waitFor(() => fireEvent.keyDown(input!, enter));
    const uuid = generateDeterministicAddressUUID('Ropsten', address);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        address,
        label: 'eth',
        network: 'Ropsten',
        notes: '',
        uuid
      })
    );
  });

  test('it select unresolved input and not add it into contacts book', async () => {
    const contacts: ExtendedContact[] = [];
    const inputString = '0x1234';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    fireEvent.blur(input!);

    expect(contacts).toHaveLength(0);
    expect(output.data.address.value).toBe(inputString);
    expect(output.data.address.display).toBe(inputString);
  });

  test('it select existing contact from contacts book by keypress enter', async () => {
    const contacts: ExtendedContact[] = mockMappedContacts.map((x) => x);
    const [contact] = contacts;
    const inputString = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), contacts, output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    await waitFor(() => fireEvent.keyDown(input!, enter));

    expect(contacts).toHaveLength(3);
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
