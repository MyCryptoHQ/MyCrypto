import React, { useState, useContext } from 'react';
import { FieldProps } from 'formik';
import { ResolutionError } from '@unstoppabledomains/resolution';

import { DomainStatus, InlineMessage } from 'v2/components';
import { Network, IReceiverAddress, ErrorObject } from 'v2/types';
import {
  AddressBookContext,
  findNextRecipientLabel,
  getBaseAssetByNetwork,
  AssetContext
} from 'v2/services/Store';
import { isValidETHAddress, isValidENSName } from 'v2/services/EthService';
import { useEffectOnce } from 'v2/vendor';
import UnstoppableResolution from 'v2/services/UnstoppableService';

import ContactLookupDropdown from './ContactLookupDropdown';

interface IContactLookupFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isValidAddress: boolean;
  isResolvingName: boolean;
  fieldProps: FieldProps;
  resolutionError: ResolutionError | undefined;
  onBlur(): void;
  clearErrors(): void;
  setIsResolvingDomain(isResolving: boolean): void;
  setResolutionError(err: ResolutionError | undefined): void;
}

const ContactLookupField = ({
  error,
  fieldProps: { field, form },
  network,
  resolutionError,
  isValidAddress,
  isResolvingName,
  onBlur,
  clearErrors,
  setIsResolvingDomain,
  setResolutionError
}: IContactLookupFieldComponentProps) => {
  const [inputValue, setInputValue] = useState();
  const {
    addressBook: contacts,
    createAddressBooks: createContact,
    getContactByAddress
  } = useContext(AddressBookContext);
  const { assets } = useContext(AssetContext);
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorType = typeof error === 'object' ? error.type : undefined;
  const { name: fieldName, value: fieldValue } = field;

  useEffectOnce(() => {
    const contact = getContactByAddress(fieldValue.value);
    if (contact && fieldValue.display !== contact.label) {
      form.setFieldValue(fieldName, { display: contact.label, value: contact.address });
    }
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    return value;
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleAddAddressBookEntry(inputValue);
    }
  };

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
    clearErrors();
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

    form.setFieldValue(fieldName, contact);
    form.setFieldTouched(fieldName);
  };

  const handleDomainResolve = async (name: string): Promise<string | undefined> => {
    if (!name || !network) {
      setIsResolvingDomain(false);
      setResolutionError(undefined);
      return;
    }
    setIsResolvingDomain(true);
    setResolutionError(undefined);
    try {
      const unstoppableAddress = await UnstoppableResolution.getResolvedAddress(
        name,
        getBaseAssetByNetwork({ network, assets })!.ticker
      );
      return unstoppableAddress;
    } catch (err) {
      // Force the field value to error so that isValidAddress is triggered!
      form.setFieldValue(fieldName, {
        ...fieldValue,
        value: ''
      });
      if (UnstoppableResolution.isResolutionError(err)) {
        setResolutionError(err);
      } else throw err;
    } finally {
      setIsResolvingDomain(false);
    }
  };

  return (
    <>
      <ContactLookupDropdown
        name={fieldName}
        value={fieldValue}
        contacts={contacts}
        onSelect={(option: IReceiverAddress) => {
          form.setFieldValue(fieldName, option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
          form.setFieldTouched(fieldName);
        }}
        onInputChange={handleInputChange}
        onBlur={(inputString: string) => {
          handleAddAddressBookEntry(inputString);
          onBlur();
        }}
        inputValue={inputValue}
        onEnterKeyDown={handleEnterKeyDown}
      />
      {(fieldValue && isValidENSName(fieldValue.value)) || isResolvingName ? (
        <DomainStatus
          domain={fieldValue.value}
          rawAddress={fieldValue.value}
          isLoading={isResolvingName}
          isError={!isValidAddress}
          resolutionError={resolutionError}
        />
      ) : (
        errorMessage && <InlineMessage type={errorType}>{errorMessage}</InlineMessage>
      )}
    </>
  );
};

export default ContactLookupField;
