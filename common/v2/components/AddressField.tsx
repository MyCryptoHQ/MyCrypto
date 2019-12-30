import React from 'react';
import { Input, Identicon } from '@mycrypto/ui';
import { FieldProps, Field, FormikTouched } from 'formik';
import styled from 'styled-components';

import { getENSTLDForChain } from 'v2/services/EthService';
import { InlineErrorMsg, ENSStatus } from 'v2/components';
import { Network, IFormikFields } from 'v2/types';
import { monospace } from 'v2/theme';

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
  handleENSResolve?(name: string): Promise<void>;
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

const SInput = styled(Input)`
  font-family: ${monospace};
`;

function ETHAddressField({
  className,
  fieldName,
  touched,
  error,
  network,
  placeholder = 'ETH Address or ENS Name',
  isLoading,
  isError,
  handleENSResolve,
  onBlur,
  onChange
}: Props) {
  // By destructuring 'field' in the rendered component we are mapping
  // the Inputs 'value' and 'onChange' props to Formiks handlers.
  return (
    <>
      <Field
        name={fieldName}
        //validate={validateEthAddress}
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
                  const ensTLD = getENSTLDForChain(network.chainId);
                  const isENSAddress = e.currentTarget.value.endsWith(`.${ensTLD}`);
                  const action =
                    isENSAddress && handleENSResolve
                      ? (ensName: string) => handleENSResolve(ensName)
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
            {handleENSResolve && (
              <ENSStatus
                ensName={form.values[fieldName].display}
                rawAddress={form.values[fieldName].value}
                chainId={network ? network.chainId : 1}
                isLoading={isLoading}
                isError={isError}
              />
            )}
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
