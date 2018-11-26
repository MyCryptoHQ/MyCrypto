import React from 'react';
import { Formik, Form, Field } from 'formik';

import './ShapeShiftPairForm.scss';

export default function ShapeShiftPairForm({
  onAssetChange,
  onAmountChange,
  deposit,
  depositAmount,
  withdraw,
  withdrawAmount
}) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        deposit,
        depositAmount,
        withdraw,
        withdrawAmount
      }}
      onSubmit={console.log}
      render={() => (
        <Form>
          <fieldset>
            <label htmlFor="deposit">I will deposit</label>
            <Field name="depositAmount" onChange={onAmountChange} />
            <Field component="select" name="deposit" onChange={onAssetChange}>
              <option value="">Select an asset</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </Field>
          </fieldset>
          <fieldset>
            <label htmlFor="withdraw">I will withdraw</label>
            <Field name="withdrawAmount" onChange={onAmountChange} />
            <Field component="select" name="withdraw" onChange={onAssetChange}>
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
