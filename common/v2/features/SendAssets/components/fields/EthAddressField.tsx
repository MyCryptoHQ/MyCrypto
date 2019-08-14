import React from 'react';
import { Input } from '@mycrypto/ui';
import { FieldProps, Field } from 'formik';

import { translateRaw } from 'translations';
import { isValidETHAddress, isValidENSName, getENSTLDForChain } from 'v2/services/EthService';
import { InlineErrorMsg, ENSStatus } from 'v2/components';
import { Network } from 'v2/types';

/*
  Eth address field to be used within a Formik Form
  - the 'fieldname' must exist wihtin the Formik default fields
  - validation of the field is handled here.
*/

interface Props {
  error?: string;
  fieldName: string;
  touched?: boolean;
  placeholder?: string;
  network: Network;
  isLoading: boolean;
  handleGasEstimate(): Promise<void>;
  handleENSResolve?(name: string): Promise<void>;
}

function ETHAddressField({
  fieldName,
  error,
  touched,
  chainId,
  placeholder = 'ETH Address or ENS Name',
  isLoading,
  handleENSResolve,
  handleGasEstimate
}: Props) {
  const validateEthAddress = (value: any) => {
    let errorMsg;
    if (!value) {
      errorMsg = translateRaw('REQUIRED');
    } else if (!isValidETHAddress(value)) {
      if (!isValidENSName(value)) {
        errorMsg = translateRaw('TO_FIELD_ERROR');
      }
    }
    return errorMsg;
  };

  // By destructuring 'field' in the rendered component we are mapping
  // the Inputs 'value' and 'onChange' props to Formiks handlers.
  return (
    <>
      <Field
        name={fieldName}
        validate={validateEthAddress}
        render={({ field, form }: FieldProps) => (
          <div>
            <Input
              {...field}
              value={field.value.display}
              placeholder={placeholder}
              onChange={e => {
                form.setFieldValue('receiverAddress', {
                  display: e.currentTarget.value,
                  value: e.currentTarget.value
                });
              }}
              onBlur={async e => {
                if (!network.chainId) {
                  return;
                }
                const ensTLD = getENSTLDForChain(network.chainId);
                const isENSAddress = e.currentTarget.value.endsWith(`.${ensTLD}`);
                const action =
                  isENSAddress && handleENSResolve
                    ? (ensName: string) => handleENSResolve(ensName)
                    : (address: string) =>
                        form.setFieldValue('receiverAddress', { display: address, value: address });
                await action(e.currentTarget.value);
                handleGasEstimate();
              }}
            />
            <ENSStatus
              ensName={form.values.receiverAddress.display}
              rawAddress={form.values.receiverAddress.value}
              chainId={network ? network.chainId : 1}
              isLoading={isLoading}
            />
          </div>
        )}
      />

      {error && touched ? (
        <InlineErrorMsg className="SendAssetsForm-errors">{error}</InlineErrorMsg>
      ) : null}
    </>
  );
}

export default ETHAddressField;
