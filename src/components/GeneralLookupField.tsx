import { FocusEventHandler, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import { ResolutionError, ResolutionErrorCode } from '@unstoppabledomains/resolution';

import { DomainStatus, InlineMessage } from '@components';
import {
  isValidENSName,
  isValidETHAddress,
  isValidETHRecipientAddress,
  ProviderHandler
} from '@services/EthService';
import { createENSResolutionError, isResolutionError } from '@services/EthService/ens';
import { selectDefaultNetwork, useSelector } from '@store';
import { ErrorObject, IReceiverAddress, Network } from '@types';

import AddressLookupSelector, { LabeledAddress } from './AddressLookupSelector';

export interface IGeneralLookupFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  options: LabeledAddress[];
  placeholder?: string;
  onBlur?: FocusEventHandler;
  setIsResolvingDomain(isResolving: boolean): void;
  handleEthAddress?(inputString: string): IReceiverAddress;
  handleENSName?(resolvedAddress: string, inputString: string): IReceiverAddress;
  onSelect?(option: IReceiverAddress): void;
  onChange?(input: string): void;
  setFieldValue?(field: string, value: any, shouldValidate?: boolean): void;
  setFieldTouched?(field: string, touched?: boolean, shouldValidate?: boolean): void;
  setFieldError?(field: string, value: string | JSX.Element | undefined): void;
}

const GeneralLookupField = ({
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
  placeholder,
  setFieldValue,
  setFieldTouched,
  setFieldError
}: IGeneralLookupFieldComponentProps) => {
  const ethNetwork = useSelector(selectDefaultNetwork);
  const errorMessage =
    error && Object.prototype.hasOwnProperty.call(error, 'message')
      ? (error as ErrorObject).message
      : error;
  const errorType = typeof error === 'object' ? error.type : undefined;
  const [resolutionError, setResolutionError] = useState<ResolutionError>();

  const handleEthAddressDefault = (inputString: string): IReceiverAddress => {
    const found = options.find((o) => o.address === inputString);
    if (found) {
      return {
        display: found.label,
        value: found.address
      };
    }
    if (handleEthAddress) return handleEthAddress(inputString);
    return {
      display: inputString,
      value: inputString
    };
  };

  useEffect(() => {
    // Run validation if possible
    if (setFieldError) {
      const validationResult = isValidETHRecipientAddress(value.value, resolutionError);
      setFieldError(name, validationResult.success ? undefined : validationResult.message);
    }
  }, [value, resolutionError]);

  const handleENSnameDefault = async (
    inputString: string,
    defaultInput: IReceiverAddress
  ): Promise<IReceiverAddress> => {
    try {
      const resolvedAddress = await handleDomainResolve(inputString);
      if (!resolvedAddress) return defaultInput;

      const [label] = inputString.split('.');

      if (handleENSName) return handleENSName(resolvedAddress, inputString);

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
      contact = handleEthAddressDefault(inputString);
    } else if (isValidENSName(inputString)) {
      contact = await handleENSnameDefault(inputString, contact);
    }

    if (setFieldValue) {
      setFieldValue(name, contact, false);
    }
    if (setFieldTouched) {
      setFieldTouched(name, true, false);
    }
  };

  const handleDomainResolve = async (domain: string): Promise<string | undefined | null> => {
    if (!domain || !network) {
      setIsResolvingDomain(false);
      setResolutionError(undefined);
      return;
    }
    setIsResolvingDomain(true);
    setResolutionError(undefined);
    try {
      const provider = new ProviderHandler(ethNetwork);
      const resolvedAddress = await provider.resolveName(domain, network);
      if (!resolvedAddress) {
        throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, { domain });
      }
      return resolvedAddress;
    } catch (err) {
      // Force the field value to error so that isValidAddress is triggered!
      if (setFieldValue) {
        setFieldValue(
          name,
          {
            ...value,
            value: ''
          },
          true
        );
      }
      if (isResolutionError(err)) {
        setResolutionError(err);
        return;
      }

      const resErr = createENSResolutionError(err);
      if (resErr) {
        setResolutionError(resErr);
        return;
      }

      throw err;
    } finally {
      setIsResolvingDomain(false);
    }
  };

  const inputValue = useRef<string>('');
  const GeneralDropdownFieldCallback = useCallback(() => {
    const handleInputChange = (input: string) => {
      inputValue.current = input;
      return input;
    };

    const handleEnterKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      if (e.keyCode === 13) {
        handleNewInput(inputValue.current);
        if (onChange) onChange(inputValue.current);
      }
    };

    return (
      <>
        <AddressLookupSelector
          name={name}
          value={value}
          options={options}
          inputValue={inputValue.current}
          onInputChange={handleInputChange}
          onSelect={(option: IReceiverAddress) => {
            // if this gets deleted, it no longer shows as selected on interface,
            // would like to set only object keys that are needed
            // instead of full object
            if (setFieldValue) {
              setFieldValue(name, option, true);
            }
            if (setFieldTouched) {
              setFieldTouched(name, true, false);
            }
            if (onSelect) {
              onSelect(option);
            }
          }}
          onBlur={(e) => {
            handleNewInput(inputValue.current);
            if (setFieldTouched) {
              setFieldTouched(name, true, false);
            }
            if (onBlur) onBlur(e);
            if (onChange) onChange(inputValue.current);
          }}
          onEnterKeyDown={handleEnterKeyDown}
          placeholder={placeholder}
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
  }, [value.display, isResolvingName, options, error]);

  return <GeneralDropdownFieldCallback />;
};

export default GeneralLookupField;
