import React from 'react';
import { Form, Formik } from 'formik';
import { simpleRender, fireEvent, wait } from 'test-utils';
import { fNetwork } from '@fixtures';

import { AssetContext } from '@services/Store';
import { ExtendedAddressBook, TUuid, IReceiverAddress } from '@types';
import { addressBook } from '@database/seed/addressBook';

import GeneralLookupField from '@components/GeneralLookupField';

interface FormValues {
  data: {
    address?: IReceiverAddress;
  };
}

const options = [
  { label: 'Label1', address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' },
  { label: 'Label2', address: '0x5678' }
];

const getDefaultProps = (error?: string) => ({
  network: fNetwork,
  isValidAddress: false,
  isResolvingName: false,
  error,
  setIsResolvingDomain: jest.fn(),
  name: 'address',
  placeholder: 'placeholder',
  options
});

const initialFormikValues: { address: IReceiverAddress } = {
  address: {
    display: '',
    value: ''
  }
};

function getComponent(props: any, output: FormValues = { data: {} }) {
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
      <Formik
        validate={mapFormValues}
        initialValues={initialFormikValues}
        onSubmit={jest.fn()}
        render={({ values }) => (
          <Form>
            <GeneralLookupField {...props} value={values.address} />
          </Form>
        )}
      />
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

describe('GeneralLookupField', () => {
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
    expect(output.data.address.display).toBe(address);
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
    expect(output.data.address.display).toBe(ens.split('.')[0]);
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
    const option = options[0];
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: option.address } });
    await wait(() => fireEvent.keyDown(input!, enter));

    expect(output.data.address).toStrictEqual({ display: option.label, value: option.address });
  });

  test('it renders inline error in case of error', async () => {
    const error = 'Error resolving ens';
    const props = getDefaultProps(error);
    const { getByText } = getComponent(props);
    expect(getByText(error)).toBeDefined();
  });
});
