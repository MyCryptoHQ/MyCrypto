import React from 'react';
import { Formik, Form, Field } from 'formik';

import './ShapeShiftPairForm.scss';

export default function ShapeShiftPairForm() {
  return (
    <Formik
      initialValues={{
        depositAsset: 'ETH',
        depositAmount: '0',
        receiveAsset: 'BTC',
        receiveAmount: '0'
      }}
      onSubmit={console.log}
      render={props => (
        <Form>
          <fieldset>
            <label htmlFor="deposit">I will deposit</label>
            <Field name="depositAmount" />
            <Field component="select" name="depositAsset">
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </Field>
          </fieldset>
          <fieldset>
            <label htmlFor="deposit">I will receive</label>
            <Field name="receiveAmount" />
            <Field component="select" name="receiveAsset">
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </Field>
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
