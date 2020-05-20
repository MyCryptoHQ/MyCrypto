import React, { useState, useContext, useCallback } from 'react';
import { Field, useFormikContext } from 'formik';
import { ResolutionError } from '@unstoppabledomains/resolution';

import { DomainStatus, InlineMessage } from '@components';
import { Network, IReceiverAddress, ErrorObject, InlineMessageType } from '@types';
import {
  AddressBookContext,
  findNextRecipientLabel,
  getBaseAssetByNetwork,
  AssetContext
} from '@services/Store';
import { isValidETHAddress, isValidENSName } from '@services/EthService';
import { useEffectOnce } from '@vendor';
import UnstoppableResolution from '@services/UnstoppableService';
import { isValidETHRecipientAddress } from '@services/EthService/validators';

import ContactLookupDropdown from './ContactLookupDropdown';

interface ContactDropdownFieldComponentProps {
  resolutionError: ResolutionError | undefined;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  onBlur?(): void;
  setIsResolvingDomain(isResolving: boolean): void;
  setResolutionError(error: ResolutionError | undefined): void;
}

const ContactDropdownField = ({
  network,
  isResolvingName,
  onBlur,
  setIsResolvingDomain,
  name,
  value,
  setResolutionError,
  resolutionError
}: ContactDropdownFieldComponentProps) => {
  const {
    addressBook: contacts,
    createAddressBooks: createContact,
    getContactByAddress
  } = useContext(AddressBookContext);
  const { assets } = useContext(AssetContext);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const handleEthAddress = (inputString: string): IReceiverAddress => {
    const contact = getContactByAddress(inputString);
    if (contact) return { display: contact.label, value: contact.address };

    const label = findNextRecipientLabel(contacts);
    createContact({
      address: inputString,
      label,
      notes: '',
      network: network.id
    });
    return {
      display: label,
      value: inputString
    };
  };

  const validateAddress = (v: IReceiverAddress) => {
    const validationResult = isValidETHRecipientAddress(v.value, resolutionError);
    if (validationResult.success) return;

    return {
      name: validationResult.name,
      type: validationResult.type,
      message: validationResult.message
    };
  };

  useEffectOnce(() => {
    const contact = getContactByAddress(value.value);
    if (contact && value.display !== contact.label) {
      setFieldValue(name, { display: contact.label, value: contact.address }, true);
    }
  });

  const handleENSname = async (
    inputString: string,
    defaultInput: IReceiverAddress
  ): Promise<IReceiverAddress> => {
    try {
      const resolvedAddress = await handleDomainResolve(inputString);
      if (!resolvedAddress) return defaultInput;

      const contact = getContactByAddress(resolvedAddress);
      if (contact) return { display: contact.label, value: contact.address };

      const [label] = inputString.split('.');
      createContact({
        address: resolvedAddress,
        label,
        notes: '',
        network: network.id
      });
      return {
        display: label,
        value: resolvedAddress
      };
    } catch (err) {
      console.debug(`[ContactLookupField] ${err}`);
      return { display: '', value: '' };
    }
  };

  const handleAddAddressBookEntry = async (inputString: string) => {
    setResolutionError(undefined);
    if (!inputString || !network || !network.id || !contacts) {
      return;
    }

    let contact: IReceiverAddress = {
      display: inputString,
      value: inputString
    };

    if (isValidETHAddress(inputString)) {
      // saves 0x address to address book labeled as "Recipient X"
      contact = handleEthAddress(inputString);
    } else if (isValidENSName(inputString)) {
      // resolves ENS name and saves it to address book labeled as first part of ENS name before "." (example.test.eth --> example)
      contact = await handleENSname(inputString, contact);
    }

    setFieldValue(name, contact, true);
    setFieldTouched(name, true, false);
  };

  const handleDomainResolve = async (domain: string): Promise<string | undefined> => {
    if (!domain || !network) {
      setIsResolvingDomain(false);
      setResolutionError(undefined);
      return;
    }
    setIsResolvingDomain(true);
    setResolutionError(undefined);
    try {
      const unstoppableAddress = await UnstoppableResolution.getResolvedAddress(
        domain,
        getBaseAssetByNetwork({ network, assets })!.ticker
      );
      return unstoppableAddress;
    } catch (err) {
      // Force the field value to error so that isValidAddress is triggered!
      setFieldValue(
        name,
        {
          ...value,
          value: ''
        },
        true
      );
      if (UnstoppableResolution.isResolutionError(err)) {
        setResolutionError(err);
      } else throw err;
    } finally {
      setIsResolvingDomain(false);
    }
  };

  const ContactDropdownFieldCallback = useCallback(() => {
    const [inputValue, setInputValue] = useState<string>('');
    const handleInputChange = (input: string) => {
      setInputValue(input);
      return input;
    };

    const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        handleAddAddressBookEntry(inputValue);
      }
    };

    return (
      <ContactLookupDropdown
        name={name}
        value={value}
        contacts={contacts}
        onSelect={(option: IReceiverAddress) => {
          setFieldValue(name, option, true); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
          setFieldTouched(name, true, false);
        }}
        onInputChange={handleInputChange}
        onBlur={(inputString: string) => {
          handleAddAddressBookEntry(inputString);
          setFieldTouched(name, true, false);
          if (onBlur) onBlur();
        }}
        inputValue={inputValue}
        onEnterKeyDown={handleEnterKeyDown}
      />
    );
  }, [value.display, isResolvingName]);

  return <Field name={name} validate={validateAddress} component={ContactDropdownFieldCallback} />;
};

interface ContactLookupErrorComponentProps {
  resolutionError: ResolutionError | undefined;
  isResolvingName: boolean;
  value: IReceiverAddress;
  errorMessage: string | JSX.Element | undefined;
  errorType: InlineMessageType | undefined;
}

const ContactLookupError = ({
  resolutionError,
  isResolvingName,
  value,
  errorMessage,
  errorType
}: ContactLookupErrorComponentProps) => (
  <>
    {(value && isValidENSName(value.value)) || isResolvingName ? (
      <DomainStatus
        domain={value.value}
        rawAddress={value.value}
        isLoading={isResolvingName}
        isError={!!errorMessage}
        resolutionError={resolutionError}
      />
    ) : (
      errorMessage && <InlineMessage type={errorType}>{errorMessage}</InlineMessage>
    )}
  </>
);

interface ContactLookupFieldComponentProps
  extends Omit<ContactDropdownFieldComponentProps, 'setResolutionError' | 'resolutionError'> {
  error?: string | ErrorObject;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  onBlur?(): void;
  setIsResolvingDomain(isResolving: boolean): void;
}

const ContactLookupField = ({
  name,
  value,
  network,
  isResolvingName,
  onBlur,
  setIsResolvingDomain,
  error
}: ContactLookupFieldComponentProps) => {
  const [resolutionError, setResolutionError] = useState<ResolutionError>();
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorType = typeof error === 'object' ? error.type : undefined;

  return (
    <>
      <ContactDropdownField
        name={name}
        value={value}
        network={network}
        isResolvingName={isResolvingName}
        onBlur={onBlur}
        setIsResolvingDomain={setIsResolvingDomain}
        resolutionError={resolutionError}
        setResolutionError={setResolutionError}
      />
      <ContactLookupError
        resolutionError={resolutionError}
        isResolvingName={isResolvingName}
        value={value}
        errorMessage={errorMessage}
        errorType={errorType}
      />
    </>
  );
};

export default ContactLookupField;
