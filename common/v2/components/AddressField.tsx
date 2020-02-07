import React from 'react';
import { Input, Identicon } from '@mycrypto/ui';
import { FieldProps, Field, FormikTouched, FormikErrors } from 'formik';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { InlineErrorMsg, DomainStatus } from 'v2/components';
import { Network, IFormikFields } from 'v2/types';
import { monospace } from 'v2/theme';
import { ResolutionError } from '@unstoppabledomains/resolution';
import UnstoppableResolution from 'v2/services/UnstoppableService';
/*
  Eth address field to be used within a Formik Form
  - the 'fieldname' must exist wihtin the Formik default fields
  - validation of the field is handled here.
*/

interface Props {
  error?: string;
  className?: string;
  fieldName: string;
  touched?: FormikTouched<IFormikFields>;
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
  align-items: center;

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

const SInput = styled(Input)<InputProps>`
  ${props => props.value && `font-family: ${monospace};`}
  font-size: 1rem !important; // to override Typography from mycrypto/ui
`;

function ETHAddressField({
  className,
  fieldName,
  touched,
  error,
  network,
  placeholder = 'ETH Address or blockchain domain',
  isLoading,
  isError,
  resolutionError,
  handleDomainResolve,
  onBlur,
  onChange
}: Props) {
  const validate = (value: string): FormikErrors<string> =>
    value && !UnstoppableResolution.isValidDomain(value)
      ? translateRaw('TO_FIELD_ERROR')
      : translateRaw('REQUIRED');

  // By destructuring 'field' in the rendered component we are mapping
  // the Inputs 'value' and 'onChange' props to Formiks handlers.
  return (
    <>
      <Field
        name={fieldName}
        validate={validate}
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
                  const action = handleDomainResolve
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
            {error && touched && touched.address ? (
              <InlineErrorMsg className="SendAssetsForm-errors">{error}</InlineErrorMsg>
            ) : null}
          </Wrapper>
        )}
      />
    </>
  );
}

export default ETHAddressField;
