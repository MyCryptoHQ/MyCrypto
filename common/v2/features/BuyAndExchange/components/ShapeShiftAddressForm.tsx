import React from 'react';
import { Formik, Form, Field } from 'formik';

interface Props {
  asset: string;
  onSubmit(values: any, bag: any): void;
}

export default function ShapeShiftAddressForm({ asset, onSubmit }: Props) {
  return (
    <Formik
      initialValues={{
        address: ''
      }}
      onSubmit={onSubmit}
      render={() => (
        <Form>
          <fieldset>
            <label htmlFor="address">Your Receiving Address ({asset})</label>
            <Field name="address" />
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
