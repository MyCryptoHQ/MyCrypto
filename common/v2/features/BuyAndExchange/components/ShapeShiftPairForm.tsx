import React from 'react';
import { Formik, Form, Field } from 'formik';

import { MarketPairHash } from 'v2/services/types';
import './ShapeShiftPairForm.scss';

interface Props {
  rates: MarketPairHash | null;
  options: string[];
  onSubmit(values: any, bag: any): void;
}

const clearAmountFields = (_: React.ChangeEvent<any>, props: any) => {
  props.setFieldValue('depositAmount', '0.00');
  props.setFieldValue('withdrawAmount', '0.00');
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

export default function ShapeShiftPairForm({ rates, options, onSubmit }: Props) {
  return rates ? (
    <Formik
      initialValues={{
        deposit: options[0],
        depositAmount: '0.00',
        withdraw: options[1],
        withdrawAmount: '0.00'
      }}
      onSubmit={onSubmit}
      render={props => {
        return (
          <Form>
            <fieldset>
              <label htmlFor="deposit">I will deposit</label>
              <Field
                name="depositAmount"
                type="number"
                step="0.01"
                onChange={(e: React.ChangeEvent<any>) =>
                  changeOtherAmountField(e, props, rates, ['deposit', 'withdraw'], 'withdrawAmount')
                }
              />
              <Field
                component="select"
                name="deposit"
                onChange={(e: React.ChangeEvent<any>) => {
                  const { target: { value: asset } } = e;
                  const { deposit, withdraw } = props.values;

                  if (asset === withdraw) {
                    props.setFieldValue('withdraw', deposit);
                  }

                  clearAmountFields(e, props);
                  props.handleChange(e);
                }}
              >
                <option value="">Select an asset</option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
            </fieldset>
            <fieldset>
              <label htmlFor="withdraw">I will withdraw</label>
              <Field
                name="withdrawAmount"
                type="number"
                step="0.01"
                onChange={(e: React.ChangeEvent<any>) =>
                  changeOtherAmountField(e, props, rates, ['withdraw', 'deposit'], 'depositAmount')
                }
              />
              <Field
                component="select"
                name="withdraw"
                onChange={(e: React.ChangeEvent<any>) => {
                  const { target: { value: asset } } = e;
                  const { deposit, withdraw } = props.values;

                  if (asset === deposit) {
                    props.setFieldValue('deposit', withdraw);
                  }

                  clearAmountFields(e, props);
                  props.handleChange(e);
                }}
              >
                <option value="">Select an asset</option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
            </fieldset>
            <fieldset>
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </fieldset>
          </Form>
        );
      }}
    />
  ) : (
    <p>Loading...</p>
  );
}
