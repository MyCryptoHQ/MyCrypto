import { ResolutionError, ResolutionErrorCode } from '@unstoppabledomains/resolution';
import { fireEvent, simpleRender, waitFor } from 'test-utils';

import GeneralLookupField from '@components/GeneralLookupField';
import { fContacts, fNetwork } from '@fixtures';
import { ProviderHandler } from '@services/EthService';
import { translateRaw } from '@translations';
import { ExtendedContact, IReceiverAddress, TUuid } from '@types';

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

function getComponent(
  props: any,
  output: FormValues = { data: { address: { value: '', display: '' } } }
) {
  const setFormValue = (address: IReceiverAddress) => {
    output.data = { address };
  };

  return simpleRender(
    <GeneralLookupField
      {...props}
      value={output.data.address}
      setFieldValue={(_, value) => setFormValue(value)}
    />
  );
}

const enter = { key: 'Enter', keyCode: 13 };
const mockMappedContacts: ExtendedContact[] = Object.entries(fContacts).map(([key, value]) => ({
  ...value,
  uuid: key as TUuid
}));

describe('GeneralLookupField', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders the placeholder when no value', async () => {
    const { getByText } = getComponent(getDefaultProps());
    const selector = 'placeholder';
    expect(getByText(selector)).toBeInTheDocument();
  });

  it('selects unresolved input after blur', async () => {
    const address = mockMappedContacts[0].address;
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: address } });
    input!.blur();

    expect(output.data.address.value).toBe(address);
    expect(output.data.address.display).toBe(address);
  });

  it('resolves ens and selects it by keypress enter', async () => {
    jest
      .spyOn(ProviderHandler.prototype, 'resolveName')
      .mockResolvedValue(mockMappedContacts[0].address);
    const address = mockMappedContacts[0].address;
    const ens = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: ens } });
    await waitFor(() => fireEvent.keyDown(input!, enter));

    expect(output.data.address.value).toBe(address);
    expect(output.data.address.display).toBe(ens.split('.')[0]);
  });

  it('handles non registrered domain', async () => {
    jest.spyOn(ProviderHandler.prototype, 'resolveName').mockResolvedValue(null);
    const ens = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container, getByText, rerender } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: ens } });

    await waitFor(() => fireEvent.keyDown(input!, enter));

    rerender(<GeneralLookupField {...getDefaultProps()} value={output.data.address} />);

    await waitFor(() => expect(getByText('Domain eth.eth is not registered')).toBeDefined());
  });

  it('handles Unstoppable errors', async () => {
    jest
      .spyOn(ProviderHandler.prototype, 'resolveName')
      .mockRejectedValue(new ResolutionError(ResolutionErrorCode.RecordNotFound));
    const ens = 'eth.crypto';
    const output = { data: { ...initialFormikValues } };
    const { container, getByText, rerender } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: ens } });

    await waitFor(() => fireEvent.keyDown(input!, enter));

    rerender(<GeneralLookupField {...getDefaultProps()} value={output.data.address} />);

    await waitFor(() =>
      expect(getByText(translateRaw('ENS_NO_ADDRESS_RECORD', { $domain: ens }))).toBeDefined()
    );
  });

  it('handles Ethers errors', async () => {
    jest
      .spyOn(ProviderHandler.prototype, 'resolveName')
      .mockRejectedValue(new Error('network does not support ENS'));
    const ens = 'eth.eth';
    const output = { data: { ...initialFormikValues } };
    const { container, getByText, rerender } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: ens } });
    await waitFor(() => fireEvent.keyDown(input!, enter));

    rerender(<GeneralLookupField {...getDefaultProps()} value={output.data.address} />);

    await waitFor(() => expect(getByText('Network is not supported')).toBeDefined());
  });

  it('selects unresolved input', async () => {
    const inputString = '0x1234';
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: inputString } });
    input!.blur();

    expect(output.data.address.value).toBe(inputString);
    expect(output.data.address.display).toBe(inputString);
  });

  it('select existing option from options by keypress enter', async () => {
    const option = options[0];
    const output = { data: { ...initialFormikValues } };
    const { container } = getComponent(getDefaultProps(), output);
    const input = container.querySelector('input');
    fireEvent.click(input!);
    input!.focus();
    fireEvent.change(input!, { target: { value: option.address } });

    await waitFor(() => fireEvent.keyDown(input!, enter));

    expect(output.data.address).toStrictEqual({ display: option.label, value: option.address });
  });

  it('renders inline error in case of error', async () => {
    const error = 'Error resolving ens';
    const props = getDefaultProps(error);
    const { getByText } = getComponent(props);
    expect(getByText(error)).toBeDefined();
  });
});
