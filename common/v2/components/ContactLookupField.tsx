import React, { useState, useContext } from 'react';
import { FieldProps, Field } from 'formik';
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
import { isValidETHRecipientAddress } from 'v2/services/EthService/validators';

import ContactLookupDropdown from './ContactLookupDropdown';

interface IContactLookupFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  onBlur?(): void;
  setIsResolvingDomain(isResolving: boolean): void;
}

const ContactLookupField = ({
  error,
  network,
  isResolvingName,
  onBlur,
  setIsResolvingDomain,
  name,
  value
}: IContactLookupFieldComponentProps) => {
  const {
    addressBook: contacts,
    createAddressBooks: createContact,
    getContactByAddress
  } = useContext(AddressBookContext);
  const { assets } = useContext(AssetContext);
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorType = typeof error === 'object' ? error.type : undefined;
  const [resolutionError, setResolutionError] = useState<ResolutionError>();

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

  return (
    <Field
      name={name}
      value={value}
      validate={validateAddress}
      component={({ form }: FieldProps) => {
        const [inputValue, setInputValue] = useState();

        useEffectOnce(() => {
          const contact = getContactByAddress(value.value);
          if (contact && value.display !== contact.label) {
            form.setFieldValue(name, { display: contact.label, value: contact.address }, true);
          }
        });

        const handleInputChange = (input: string) => {
          setInputValue(input);
          return input;
        };

        const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.keyCode === 13) {
            handleAddAddressBookEntry(inputValue);
          }
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

          form.setFieldValue(name, contact, true);
          form.setFieldTouched(name, true, false);
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
            form.setFieldValue(
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

        return (
          <>
            <ContactLookupDropdown
              name={name}
              value={value}
              contacts={contacts}
              onSelect={(option: IReceiverAddress) => {
                form.setFieldValue(name, option, true); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                form.setFieldTouched(name, true, false);
              }}
              onInputChange={handleInputChange}
              onBlur={(inputString: string) => {
                handleAddAddressBookEntry(inputString);
                form.setFieldTouched(name, true, false);
                if (onBlur) onBlur();
              }}
              inputValue={inputValue}
              onEnterKeyDown={handleEnterKeyDown}
            />
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
      }}
    />
  );
};

export default ContactLookupField;
