import React, { useState, useContext } from 'react';
import { FieldProps } from 'formik';
import { ResolutionError } from '@unstoppabledomains/resolution';

import { DomainStatus, InlineMessage } from 'v2/components';
import { Network, InlineMessageType, ExtendedAddressBook } from 'v2/types';
import { AddressBookContext, findNextRecipientLabel } from 'v2/services/Store';
import { isValidETHAddress, isValidENSName } from 'v2/services/EthService';
import { useEffectOnce } from 'v2/vendor';

import AccountLookupDropdown from './AccountLookupDropdown';

interface ErrorObject {
  type: InlineMessageType;
  message: string | JSX.Element;
}

interface IAddressFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isValidAddress: boolean;
  isResolvingName: boolean;
  fieldProps: FieldProps;
  resolutionError: ResolutionError | undefined;
  onBlur(): void;
  handleDomainResolve(domain: string): Promise<string | undefined>;
  clearErrors(): void;
}

const getExistingAddressbook = (addressBook: ExtendedAddressBook[], address: string) => {
  const existingAddressBook = addressBook.find(book => book.address === address);
  if (!existingAddressBook) return;

  return {
    display: existingAddressBook.label,
    value: existingAddressBook.address
  };
};

const AddressLookupField = ({
  error,
  fieldProps: { field, form },
  network,
  resolutionError,
  isValidAddress,
  isResolvingName,
  onBlur,
  handleDomainResolve,
  clearErrors
}: IAddressFieldComponentProps) => {
  const [inputValue, setInputValue] = useState();
  const { addressBook, createAddressBooks } = useContext(AddressBookContext);
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorType = typeof error === 'object' ? error.type : undefined;
  const { name: fieldName, value: fieldValue } = field;

  useEffectOnce(() => {
    const existingAddressBook = getExistingAddressbook(addressBook, fieldValue.value);
    if (existingAddressBook && fieldValue.display !== existingAddressBook.display) {
      form.setFieldValue(fieldName, existingAddressBook);
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

  const handleETHaddress = (inputString: string) => {
    const existingAddressBook = getExistingAddressbook(addressBook, inputString);
    if (existingAddressBook) return existingAddressBook;

    const label = findNextRecipientLabel(addressBook);
    createAddressBooks({
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

  const handleENSname = async (inputString: string, defaultInput: FieldProps['field']['value']) => {
    const resolvedAddress = await handleDomainResolve(inputString);
    if (!resolvedAddress) return defaultInput;

    const existingAddressBook = getExistingAddressbook(addressBook, resolvedAddress);
    if (existingAddressBook) return existingAddressBook;

    const [label] = inputString.split('.');
    createAddressBooks({
      address: resolvedAddress,
      label,
      notes: '',
      network: network.id
    });
    return {
      display: label,
      value: resolvedAddress
    };
  };

  const handleAddAddressBookEntry = async (inputString: string) => {
    clearErrors();
    if (!inputString || !network || !network.id || !addressBook) {
      return;
    }

    let resolvedInput: FieldProps['field']['value'] = {
      display: inputString,
      value: inputString
    };

    if (isValidETHAddress(inputString)) {
      // saves 0x address to address book labeled as "Recipient X"
      resolvedInput = handleETHaddress(inputString);
    } else if (isValidENSName(inputString)) {
      // resolves ENS name and saves it to address book labeled as first part of ENS name before "." (example.test.eth --> example)
      resolvedInput = await handleENSname(inputString, resolvedInput);
    }

    form.setFieldValue(fieldName, resolvedInput);
    form.setFieldTouched(fieldName);
  };

  return (
    <>
      <AccountLookupDropdown
        name={fieldName}
        value={fieldValue}
        accounts={addressBook}
        onSelect={(option: any) => {
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

export default AddressLookupField;
