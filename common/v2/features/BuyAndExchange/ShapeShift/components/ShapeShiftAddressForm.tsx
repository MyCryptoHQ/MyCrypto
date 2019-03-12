import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors, FieldProps, FormikActions } from 'formik';

import { donationAddressHash } from 'v2/config';
import { addressValidatorHash } from 'v2/utils';

// Legacy
import { Warning } from 'components/ui';

const initialValues = {
  address: ''
};

interface Props {
  addressInputRef: React.RefObject<any>;
  asset: string;
  onSubmit(values: typeof initialValues, bag: FormikActions<typeof initialValues>): void;
}

const validate = (
  values: typeof initialValues,
  asset: string
): FormikErrors<typeof initialValues> => {
  const validator = addressValidatorHash[asset];
  const { address } = values;
  const errors: FormikErrors<typeof initialValues> = {};

  // Address
  if (!validator(address)) {
    errors.address = `Please enter a valid ${asset} address.`;
  }

  return errors;
};

export default function ShapeShiftAddressForm({ addressInputRef, asset, onSubmit }: Props) {
  return (
    <Formik
      initialValues={initialValues}
      validate={(values: typeof initialValues) => validate(values, asset)}
      onSubmit={onSubmit}
      render={props => (
        <section className="ShapeShiftWidget">
          <Form>
            <fieldset className="dark">
              <label htmlFor="address">Your Receiving Address ({asset})</label>
              <section className="ShapeShiftWidget-input-wrapper">
                <Field
                  name="address"
                  render={({ field, form }: FieldProps<typeof initialValues>) => (
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
