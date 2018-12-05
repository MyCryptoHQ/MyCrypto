import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik';

import { donationAddressHash } from 'v2/config';
import { addressValidatorHash } from 'v2/utils';

// Legacy
import { Warning } from 'components/ui';

interface Values {
  address: string;
}

interface Props {
  addressInputRef: React.RefObject<any>;
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

export default function ShapeShiftAddressForm({ addressInputRef, asset, onSubmit }: Props) {
  return (
    <Formik
      initialValues={{
        address: ''
      }}
      validate={values => validate(values, asset)}
      onSubmit={onSubmit}
      render={props => (
        <section className="ShapeShiftWidget">
          <Form>
            <fieldset className="dark">
              <label htmlFor="address">Your Receiving Address ({asset})</label>
              <section className="ShapeShiftWidget-input-wrapper">
                <Field
                  name="address"
                  render={({ field, form }: any) => (
                    <input
                      ref={addressInputRef}
                      className="ShapeShiftWidget-input smallest"
                      {...field}
                      placeholder={donationAddressHash[asset] || ''}
                      onChange={form.handleChange}
                    />
                  )}
                />
              </section>
            </fieldset>
            <fieldset>
              <button type="submit" className="btn ShapeShiftWidget-button">
                Continue
              </button>
            </fieldset>
          </Form>
          {props.touched.address &&
            props.errors.address && (
              <Warning highlighted={true}>
                <ErrorMessage name="address" />
              </Warning>
            )}
        </section>
      )}
    />
  );
}
