import React, { useState, useContext } from 'react';
import { FieldProps, Field, FormikProps } from 'formik';
import { ResolutionError } from '@unstoppabledomains/resolution';

import { DomainStatus, InlineMessage } from '@components';
import { Network, IReceiverAddress, ErrorObject } from '@types';
import { getBaseAssetByNetwork, AssetContext } from '@services/Store';
import { isValidETHAddress, isValidENSName } from '@services/EthService';
import UnstoppableResolution from '@services/UnstoppableService';
import { isValidETHRecipientAddress } from '@services/EthService/validators';
import { useEffectOnce } from '@vendor';

import ContactLookupDropdown from './ContactLookupDropdown';

export interface IGenericLookupFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  options: IReceiverAddress[];
  onBlur?(): void;
  setIsResolvingDomain(isResolving: boolean): void;
  handleEthAddress(inputString: string): IReceiverAddress;
  handleENSName(resolvedAddress: string, inputString: string): IReceiverAddress;
  onSelect?(option: IReceiverAddress): void;
  onChange?(input: string): void;
  onLoad?(form: FormikProps<any>): void;
}

const GenericLookupField = ({
  error,
  network,
  isResolvingName,
  onBlur,
  onSelect,
  onChange,
  handleEthAddress,
  handleENSName,
  setIsResolvingDomain,
  name,
  value,
  options,
  onLoad
}: IGenericLookupFieldComponentProps) => {
  const { assets } = useContext(AssetContext);
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorType = typeof error === 'object' ? error.type : undefined;
  const [resolutionError, setResolutionError] = useState<ResolutionError>();

  const handleEthAddressDefault = (inputString: string): IReceiverAddress => {
    if (handleEthAddress) return handleEthAddress(inputString);
    return {
      display: inputString,
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
        const [inputValue, setInputValue] = useState<string>('');

        useEffectOnce(() => {
          if (value && value.value && onLoad) {
            onLoad(form);
          }
        });

        const handleInputChange = (input: string) => {
          setInputValue(input);
          return input;
        };

        const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.keyCode === 13) {
            handleNewInput(inputValue);
          }
        };

        const handleENSnameDefault = async (
          inputString: string,
          defaultInput: IReceiverAddress
        ): Promise<IReceiverAddress> => {
          try {
            const resolvedAddress = await handleDomainResolve(inputString);
            if (!resolvedAddress) return defaultInput;

            const [label] = inputString.split('.');

            if (handleENSName) return handleENSName(inputString, inputString);

            return {
              display: label,
              value: resolvedAddress
            };
          } catch (err) {
            console.debug(`[GenericLookupField] ${err}`);
            return { display: '', value: '' };
          }
        };

        const handleNewInput = async (inputString: string) => {
          setResolutionError(undefined);
          if (!inputString || !network || !network.id || !options) {
            return;
          }

          let contact: IReceiverAddress = {
            display: inputString,
            value: inputString
          };

          if (isValidETHAddress(inputString)) {
            // saves 0x address to address book labeled as "Recipient X"
            contact = handleEthAddressDefault(inputString);
          } else if (isValidENSName(inputString)) {
            // resolves ENS name and saves it to address book labeled as first part of ENS name before "." (example.test.eth --> example)
            contact = await handleENSnameDefault(inputString, contact);
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
              contacts={options}
              onSelect={(option: IReceiverAddress) => {
                form.setFieldValue(name, option, true); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                form.setFieldTouched(name, true, false);
                if (onSelect) {
                  onSelect(option);
                }
              }}
              onInputChange={handleInputChange}
              onBlur={(inputString: string) => {
                handleNewInput(inputString);
                form.setFieldTouched(name, true, false);
                if (onBlur) onBlur();
                if (onChange) onChange(inputString);
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

export default GenericLookupField;
