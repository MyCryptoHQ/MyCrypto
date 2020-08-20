import React from 'react';
import { simpleRender, fireEvent, wait } from 'test-utils';
import { fNetwork, fContracts } from '@fixtures';

import { AssetContext } from '@services/Store';
import { ExtendedAddressBook, TUuid, IReceiverAddress } from '@types';
import { addressBook } from '@database/seed/addressBook';

import ContractLookupField from '@components/ContractLookupField';

interface FormValues {
  data: {
    address?: IReceiverAddress;
  };
}

const getDefaultProps = (error?: string) => ({
  network: fNetwork,
  error,
  setIsResolvingDomain: jest.fn(),
  name: 'address',
  placeholder: 'placeholder',
  contracts: fContracts
});

const initialFormikValues: { address: IReceiverAddress } = {
  address: {
    display: '',
    value: ''
  }
};

function getComponent(
  props: any,
  output: FormValues = { data: { address: { value: '', display: '' } } }
) {
  const setFormValue = (address: IReceiverAddress) => {
    output.data = { address };
  };

  return simpleRender(
    <AssetContext.Provider
      value={
        ({
          assets: [{ uuid: fNetwork.baseAsset }]
        } as unknown) as any
      }
    >
      <ContractLookupField
        {...props}
        value={output.data.address}
        setFieldValue={(_, value) => setFormValue(value)}
      />
      )} />
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
jest.mock('@services/UnstoppableService', () => ({
  getResolvedAddress: () => mockMappedContacts[0].address
}));

describe('ContractLookupField', () => {
  test('it renders the placeholder when no value', async () => {
    const { getByText } = getComponent(getDefaultProps());
    const selector = 'placeholder';
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('it selects unresolved input after blur', async () => {
    const address = mockMappedContacts[0].address;
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: address } });
    fireEvent.blur(input!);

    expect(output.data.address.value).toBe(address);
    expect(output.data.address.display).toBe('Contract');
  });

  test('it resolves ens and selects it by keypress enter', async () => {
    const address = mockMappedContacts[0].address;
    const ens = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: ens } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(output.data.address.value).toBe(address);
    expect(output.data.address.display).toBe('Contract');
  });

  test('it selects unresolved input', async () => {
    const inputString = '0x1234';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: inputString } });
    fireEvent.blur(input!);

    expect(output.data.address.value).toBe(inputString);
    expect(output.data.address.display).toBe(inputString);
  });

  test('it select existing option from options by keypress enter', async () => {
    const option = fContracts[0];
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: option.address } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(output.data.address).toStrictEqual({ display: option.name, value: option.address });
  });

  test('it renders inline error in case of error', async () => {
    const error = 'Error resolving ens';
    const props = getDefaultProps(error);
    const { getByText } = getComponent(props);
    expect(getByText(error)).toBeDefined();
  });
});
