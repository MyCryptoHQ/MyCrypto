import React from 'react';
import { Identicon } from '@mycrypto/ui';
import { FieldProps, Field } from 'formik';
import styled from 'styled-components';

import { Network, InlineMessageType } from '@types';
import { DomainStatus } from '@components';
import { getIsValidENSAddressFunction, isValidENSName } from '@services/EthService';
import { monospace } from '@theme';
import { translateRaw } from '@translations';
import { ResolutionError } from '@unstoppabledomains/resolution/build/resolutionError';
import InputField from '@components/InputField';
import { InlineMessage } from '@components/InlineMessage';

/*
  Eth address field to be used within a Formik Form
  - the 'fieldname' must exist wihtin the Formik default fields
  - validation of the field is handled here.
*/

interface ErrorObject {
  type: InlineMessageType;
  message: string | JSX.Element;
}

interface Props {
  error?: string | ErrorObject;
  className?: string;
  fieldName: string;
  resolvedAddress?: string;
  placeholder?: string;
  network?: Network;
  isLoading: boolean;
  isError: boolean;
  isResolvingName: boolean;
  resolutionError?: ResolutionError;
  handleDomainResolve?(name: string): Promise<void>;
  onBlur?(ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onChange?(event: any): void;
}

const Wrapper = styled.div`
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;

  > div:nth-child(2) {
    flex: 1;
  }
`;

const IdenticonWrapper = styled.div`
  width: 45px;
  margin-right: 0.5em;
`;

const EmptyIdenticon = styled.span`
  display: block;
  width: 45px;
  height: 45px;
  background-color: #f7f7f7;
  border-radius: 50%;
`;

interface InputProps {
  value: string;
}

const SInput = styled(InputField)<InputProps>`
  ${(props) => props.value && `font-family: ${monospace};`}
  /* Override Typography from mycrypto/ui */
  font-size: 1rem !important;
`;

function ETHAddressField({
  className,
  fieldName,
  error,
  network,
  placeholder = translateRaw('ETH_ADDRESS_PLACEHOLDER'),
  isLoading,
  isError,
  isResolvingName,
  resolvedAddress,
  resolutionError,
  handleDomainResolve,
  onBlur,
  onChange
}: Props) {
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorType = typeof error === 'object' ? error.type : undefined;

  // By destructuring 'field' in the rendered component we are mapping
  // the Inputs 'value' and 'onChange' props to Formiks handlers.
  return (
    <>
      <Field name={fieldName} validateOnChange={false}>
        {({ field, form }: FieldProps) => {
          const value = resolvedAddress ? resolvedAddress : field.value.value;
          return (
            <Wrapper className={className}>
              <InputWrapper>
                <IdenticonWrapper>
                  {field.value.value ? (
                    <Identicon address={field.value.value} />
                  ) : (
                    <EmptyIdenticon />
                  )}
                </IdenticonWrapper>
                <SInput
                  data-lpignore="true"
                  {...field}
                  marginBottom={'0'}
                  value={field.value.display}
                  placeholder={placeholder}
                  onChange={(e) => {
                    form.setFieldValue(fieldName, {
                      display: e.currentTarget.value,
                      value: e.currentTarget.value
                    });
                    if (onChange) {
                      onChange(e);
                    }
                  }}
                  onBlur={async (e) => {
                    if (!network || !network.chainId) {
                      return;
                    }
                    const isValidENSAddress = getIsValidENSAddressFunction(network.chainId);
                    const isENSAddress = isValidENSAddress(e.currentTarget.value);
                    const action =
                      isENSAddress && handleDomainResolve
                        ? (domainName: string) => handleDomainResolve(domainName)
                        : (address: string) =>
                            form.setFieldValue(fieldName, { display: address, value: address });
                    await action(e.currentTarget.value);
                    form.setFieldTouched(fieldName);
                    if (onBlur) {
                      onBlur(e);
                    }
                  }}
                />
              </InputWrapper>
              {(field.value && isValidENSName(field.value.value)) || isResolvingName ? (
                <DomainStatus
                  domain={value}
                  rawAddress={value}
                  isLoading={isLoading}
                  isError={isError}
                  resolutionError={resolutionError}
                />
              ) : (
                errorMessage && <InlineMessage type={errorType}>{errorMessage}</InlineMessage>
              )}
            </Wrapper>
          );
        }}
      </Field>
    </>
  );
}

export default ETHAddressField;
