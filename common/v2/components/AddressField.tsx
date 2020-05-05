import React from 'react';
import { Identicon } from '@mycrypto/ui';
import { FieldProps, Field } from 'formik';
import styled from 'styled-components';

import { Network, InlineMessageType } from 'v2/types';
import { DomainStatus } from 'v2/components';
import { getIsValidENSAddressFunction } from 'v2/services/EthService';
import { monospace } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import { ResolutionError } from '@unstoppabledomains/resolution';
import InputField from './InputField';

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
  placeholder?: string;
  network?: Network;
  isLoading: boolean;
  isError: boolean;
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
  ${props => props.value && `font-family: ${monospace};`}
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
      <Field
        name={fieldName}
        validateOnChange={false}
        render={({ field, form }: FieldProps) => (
          <Wrapper className={className}>
            <InputWrapper>
              <IdenticonWrapper>
                {field.value.value ? <Identicon address={field.value.value} /> : <EmptyIdenticon />}
              </IdenticonWrapper>
              <SInput
                data-lpignore="true"
                {...field}
                inputErrorType={errorType}
                inputError={errorMessage}
                marginBottom={'0'}
                value={field.value.display}
                placeholder={placeholder}
                onChange={e => {
                  form.setFieldValue(fieldName, {
                    display: e.currentTarget.value,
                    value: e.currentTarget.value
                  });
                  if (onChange) {
                    onChange(e);
                  }
                }}
                onBlur={async e => {
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
            <DomainStatus
              domain={form.values[fieldName].value}
              rawAddress={form.values[fieldName].value}
              isLoading={isLoading}
              isError={isError}
              resolutionError={resolutionError}
            />
          </Wrapper>
        )}
      />
    </>
  );
}

export default ETHAddressField;
