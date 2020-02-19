import React, { useState, useContext } from 'react';
import { FieldProps } from 'formik';

import { DomainStatus } from 'v2/components';
import { Network } from 'v2/types';
import { AddressBookContext, isValidENSName, isValidETHAddress } from 'v2';
import AccountLookupDropdown from './AccountLookupDropdown';
import { ResolutionError } from '@unstoppabledomains/resolution';

interface IAddressFieldComponentProps {
  network: Network;
  isValidAddress: boolean;
  isResolvingName: boolean;
  fieldProps: FieldProps;
  resolutionError: ResolutionError | undefined;
  handleGasEstimate(): void;
  handleDomainResolve(domain: string): Promise<string | undefined>;
}

function AddressLookupField({
  fieldProps: { field, form },
  network,
  resolutionError,
  isValidAddress,
  isResolvingName,
  handleGasEstimate,
  handleDomainResolve
}: IAddressFieldComponentProps) {
  const fieldName = 'address';
  const [inputValue, setInputValue] = useState();
  const { addressBook, createAddressBooks } = useContext(AddressBookContext);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    return value;
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && inputValue) {
      handleAddAddressBookEntry(inputValue);
    }
  };
  const handleETHaddress = (inputString: string) => {
    const defaultLabel = 'Recipient';
    const defaultRecipientsCount = addressBook.filter(book => book.label.startsWith(defaultLabel))
      .length;
    const label = `${defaultLabel} ${defaultRecipientsCount + 1}`; // prepare default label for to add new address to address book

    const existingAddressBook = addressBook.find(book => book.address === inputString);
    if (existingAddressBook) {
      form.setFieldValue(fieldName, {
        display: existingAddressBook.label,
        value: existingAddressBook.address
      });
    } else {
      createAddressBooks({
        address: inputString,
        label,
        notes: '',
        network: network.id // should we use chainId?
      });
      form.setFieldValue(fieldName, {
        display: label,
        value: inputString
      });
    }
  };

  const handleENSname = async (inputString: string) => {
    const resolvedAddress = await handleDomainResolve(inputString);
    const existingAddressBook = addressBook.find(book => book.address === resolvedAddress);

    if (existingAddressBook) {
      form.setFieldValue(fieldName, {
        display: existingAddressBook.label,
        value: existingAddressBook.address
      });
    } else {
      const label = inputString.split('.')[0];
      if (resolvedAddress) {
        createAddressBooks({
          address: resolvedAddress,
          label,
          notes: '',
          network: network.id
        });
        form.setFieldValue(fieldName, {
          display: label,
          value: resolvedAddress
        });
      }
    }
  };
  const handleAddAddressBookEntry = async (inputString: string) => {
    if (!inputString || !network || !network.id || !addressBook) {
      return;
    }
    if (isValidETHAddress(inputString)) {
      // saves 0x address to address book labeled as "Recipient X"
      handleETHaddress(inputString);
    } else if (isValidENSName(inputString)) {
      // resolves ENS name and saves it to address book labeled as first part of ENS name before "." (example.test.eth --> example)
      handleENSname(inputString);
    }
  };

  return (
    <>
      <AccountLookupDropdown
        name={fieldName}
        value={field.value}
        accounts={addressBook}
        onSelect={(option: any) => {
          form.setFieldValue(fieldName, option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
        }}
        onInputChange={handleInputChange}
        onBlur={inputString => {
          handleAddAddressBookEntry(inputString);
          handleGasEstimate();
        }}
        inputValue={inputValue}
        onEnterKeyDown={handleEnterKeyDown}
      />
      <DomainStatus
        domain={form.values[fieldName].value}
        rawAddress={form.values[fieldName].value}
        isLoading={isResolvingName}
        isError={!isValidAddress}
        resolutionError={resolutionError}
      />
    </>
  );
}

export default AddressLookupField;
