import {
  actionWithPayload,
  fireEvent,
  mockAppState,
  mockUseDispatch,
  simpleRender,
  waitFor
} from 'test-utils';

import { fAssets, fContacts, fNetwork } from '@fixtures';
import { ProviderHandler } from '@services/EthService';
import { ExtendedContact, IReceiverAddress, LSKeys, TUuid } from '@types';
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
  contacts: ExtendedContact[] = [],
  output: FormValues = { data: { address: { value: '', display: '' } } }
) {
  const setFormValue = (address: IReceiverAddress) => {
    output.data = { address };
  };

  return simpleRender(
    <ContactLookupField
      {...props}
      value={output.data.address}
      setFieldValue={(_, value) => setFormValue(value)}
    />,
    {
      initialState: mockAppState({
        assets: fAssets,
        [LSKeys.ADDRESS_BOOK]: contacts
      })
    }
  );
}

const enter = { key: 'Enter', keyCode: 13 };
const mockMappedContacts: ExtendedContact[] = Object.entries(fContacts).map(([key, value]) => ({
  ...value,
  uuid: key as TUuid
}));

// mock domain resolving function
ProviderHandler.prototype.resolveName = jest.fn().mockResolvedValue(mockMappedContacts[0].address);

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
    input!.focus();
    fireEvent.change(input!, { target: { value: address } });
    input!.blur();
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
    input!.focus();
    fireEvent.change(input!, { target: { value: inputString } });
    input!.blur();

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
    input!.focus();
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
