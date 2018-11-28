import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik';

import { addressValidatorHash } from 'v2/utils';

interface Values {
  address: string;
}

interface Props {
  asset: string;
  onSubmit(values: any, bag: any): void;
}

const validate = (values: Values, asset: string): FormikErrors<Values> => {
  const validator = addressValidatorHash[asset];
  const { address } = values;
  const errors: FormikErrors<Values> = {};

  // Address
  if (!validator(address)) {
    errors.address = `Please enter a valid ${asset} address.`;
  }

  return errors;
};

export default function ShapeShiftAddressForm({ asset, onSubmit }: Props) {
  return (
    <Formik
      initialValues={{
        address: ''
      }}
      validate={values => validate(values, asset)}
      onSubmit={onSubmit}
      render={() => (
        <Form>
          <fieldset>
            <label htmlFor="address">Your Receiving Address ({asset})</label>
            <Field name="address" />
            <ErrorMessage name="address" />
          </fieldset>
          <fieldset>
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </fieldset>
        </Form>
      )}
    />
  );
}
