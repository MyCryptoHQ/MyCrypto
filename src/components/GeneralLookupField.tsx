import React, { useRef, useState, useContext, useCallback } from 'react';
import { Field, useFormikContext } from 'formik';
import { ResolutionError } from '@unstoppabledomains/resolution/build/resolutionError';

import { DomainStatus, InlineMessage } from '@components';
import { Network, IReceiverAddress, ErrorObject } from '@types';
import { getBaseAssetByNetwork, AssetContext } from '@services/Store';
import { isValidETHAddress, isValidENSName } from '@services/EthService';
import UnstoppableResolution from '@services/UnstoppableService';
import { isValidETHRecipientAddress } from '@services/EthService/validators';
import { useEffectOnce } from '@vendor';

import GeneralLookupDropdown, { LabeledAddress } from './GeneralLookupDropdown';

export interface IGeneralLookupFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  options: LabeledAddress[];
  placeholder?: string;
  onBlur?(): void;
  setIsResolvingDomain(isResolving: boolean): void;
  handleEthAddress?(inputString: string): IReceiverAddress;
  handleENSName?(resolvedAddress: string, inputString: string): IReceiverAddress;
  onSelect?(option: IReceiverAddress): void;
  onChange?(input: string): void;
  onLoad?(setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void): void;
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
  onLoad,
  placeholder
}: IGeneralLookupFieldComponentProps) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const { assets } = useContext(AssetContext);
  const errorMessage = typeof error === 'object' ? error.message : error;
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
    if (value && value.value && onLoad) {
      onLoad(setFieldValue);
    }
  });

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

  const GeneralDropdownFieldCallback = useCallback(() => {
    const inputValue = useRef<string>('');

    const handleInputChange = (input: string) => {
      inputValue.current = input;
      return input;
    };

    const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        handleNewInput(inputValue.current);
      }
    };

    return (
      <>
        <GeneralLookupDropdown
          name={name}
          value={value}
          options={options}
          inputValue={inputValue.current}
          onInputChange={handleInputChange}
          onSelect={(option: IReceiverAddress) => {
            // if this gets deleted, it no longer shows as selected on interface,
            // would like to set only object keys that are needed
            // instead of full object
            setFieldValue(name, option, true);
            setFieldTouched(name, true, false);
            if (onSelect) {
              onSelect(option);
            }
          }}
          onBlur={() => {
            handleNewInput(inputValue.current);
            setFieldTouched(name, true, false);
            if (onBlur) onBlur();
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

  return <Field name={name} validate={validateAddress} component={GeneralDropdownFieldCallback} />;
};

export default GeneralLookupField;
