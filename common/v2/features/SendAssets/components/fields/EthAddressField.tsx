import React from 'react';
import { Field, FieldProps } from 'formik';
import { Input } from '@mycrypto/ui';

import { isValidETHAddress } from 'v2/services/EthService';
import { InlineErrorMsg } from 'v2/components';

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
}

function ETHAddressField({ fieldName, error, touched, placeholder = 'Eth Address' }: Props) {
  const validateEthAddress = (value: any) => {
    let errorMsg;
    if (!value) {
      errorMsg = 'Required';
    } else if (!isValidETHAddress(value)) {
      errorMsg = 'Enter a valid address';
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
        render={({ field }: FieldProps) => <Input {...field} placeholder={placeholder} />}
      />
      {error && touched ? (
        <InlineErrorMsg className="SendAssetsForm-errors">{error}</InlineErrorMsg>
      ) : null}
    </>
  );
}

export default ETHAddressField;
