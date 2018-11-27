import React from 'react';
import { Formik, Form, Field } from 'formik';

import { MarketPairHash } from 'v2/services/types';
import './ShapeShiftPairForm.scss';

interface Props {
  rates: MarketPairHash | null;
  onSubmit(values: any, bag: any): void;
}

const clearAmountFields = (e: React.ChangeEvent<any>, props: any) => {
  props.setFieldValue('depositAmount', '0.00');
  props.setFieldValue('withdrawAmount', '0.00');
  props.handleChange(e);
};

const changeOtherAmountField = (
  e: React.ChangeEvent<any>,
  props: any,
  rates: MarketPairHash,
  order: string[],
  otherFieldName: string
) => {
  const { target: { value } } = e;
  const pair = order
    .map(name => props.values[name])
    .join('_')
    .toUpperCase();
  const { rate } = rates[pair];
  const amount = (value * rate).toString();

  props.setFieldValue(otherFieldName, amount);
  props.handleChange(e);
};

export default function ShapeShiftPairForm({ rates, onSubmit }: Props) {
  return rates ? (
    <Formik
      initialValues={{
        deposit: 'BTC',
        depositAmount: '0.00',
        withdraw: 'ETH',
        withdrawAmount: '0.00'
      }}
      onSubmit={onSubmit}
      render={props => (
        <Form>
          <fieldset>
            <label htmlFor="deposit">I will deposit</label>
            <Field
              name="depositAmount"
              onChange={(e: React.ChangeEvent<any>) =>
                changeOtherAmountField(e, props, rates, ['deposit', 'withdraw'], 'withdrawAmount')
              }
            />
            <Field
              component="select"
              name="deposit"
              onChange={(e: React.ChangeEvent<any>) => clearAmountFields(e, props)}
            >
              <option value="">Select an asset</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </Field>
          </fieldset>
          <fieldset>
            <label htmlFor="withdraw">I will withdraw</label>
            <Field
              name="withdrawAmount"
              onChange={(e: React.ChangeEvent<any>) =>
                changeOtherAmountField(e, props, rates, ['withdraw', 'deposit'], 'depositAmount')
              }
            />
            <Field
              component="select"
              name="withdraw"
              onChange={(e: React.ChangeEvent<any>) => clearAmountFields(e, props)}
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
  ) : (
    <p>Loading...</p>
  );
}
