import React from 'react';
import { Formik, Form, Field } from 'formik';

export default function ShapeShiftAddressForm({
  onAddressChange,
  withdrawalAsset,
  withdrawalAddress,
  onSubmit
}) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        withdrawalAddress
      }}
      onSubmit={onSubmit}
      render={() => (
        <Form>
          <fieldset>
            <label htmlFor="withdrawalAddress">Your Receiving Address ({withdrawalAsset})</label>
            <Field name="withdrawalAddress" onChange={onAddressChange} />
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
