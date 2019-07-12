import { Input } from '@mycrypto/ui';
import { Field, FieldProps } from 'formik';
import { isValidETHAddress } from 'libs/validators';
import React from 'react';
import { translateRaw } from 'translations';
import { InlineErrorMsg } from 'v2/components';
import { getENSTLDForChain } from 'v2/libs/ens/networkConfigs';
import { isValidENSName } from 'v2/libs/validators';
import { IFormikFields } from '../../types';

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
  chainId: number;
  handleENSResolve?(name: string): Promise<void>;
}

function ETHAddressField({
  fieldName,
  error,
  touched,
  chainId,
  placeholder = 'Eth Address',
  handleENSResolve
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
          <Input
            {...field}
            placeholder={placeholder}
            onBlur={e => {
              if (chainId) {
                const ensTLD = getENSTLDForChain(chainId);
                const isENSAddress = e.currentTarget.value.endsWith(`.${ensTLD}`);
                form.setFieldValue('resolvedNSAddress', '');
                if (isENSAddress && handleENSResolve) {
                  handleENSResolve(e.currentTarget.value);
                }
              }
            }}
          />
        )}
      />
      {error && touched ? (
        <InlineErrorMsg className="SendAssetsForm-errors">{error}</InlineErrorMsg>
      ) : null}
    </>
  );
}

export default ETHAddressField;
