import React from 'react';
import { Formik, Form, Field } from 'formik';

import './ShapeShiftPairForm.scss';

export default function ShapeShiftPairForm({ onAssetChange }) {
  return (
    <Formik
      initialValues={{
        depositAsset: '',
        depositAmount: '0',
        receiveAsset: '',
        receiveAmount: '0'
      }}
      onSubmit={console.log}
      render={({ handleChange }) => (
        <Form>
          <fieldset>
            <label htmlFor="deposit">I will deposit</label>
            <Field name="depositAmount" />
            <Field
              component="select"
              name="depositAsset"
              onChange={e => {
                handleChange(e);
                onAssetChange(e);
              }}
            >
              <option value="">Select an asset</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </Field>
          </fieldset>
          <fieldset>
            <label htmlFor="withdraw">I will receive</label>
            <Field name="withdrawAmount" />
            <Field
              component="select"
              name="withdrawAsset"
              onChange={e => {
                handleChange(e);
                onAssetChange(e);
              }}
            >
              <option value="">Select an asset</option>
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
