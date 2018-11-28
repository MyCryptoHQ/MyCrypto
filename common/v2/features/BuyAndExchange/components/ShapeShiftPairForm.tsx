import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik';

import { MarketPairHash } from 'v2/services/types';
import './ShapeShiftPairForm.scss';

interface Values {
  deposit: string;
  depositAmount: string;
  withdraw: string;
  withdrawAmount: string;
}

interface Props {
  rates: MarketPairHash | null;
  options: string[];
  onSubmit(values: any, bag: any): void;
}

const validate = (values: Values, rates: MarketPairHash): FormikErrors<Values> => {
  const { deposit, depositAmount, withdraw } = values;
  const pair = `${withdraw}_${deposit}`.toUpperCase();
  const { min, maxLimit } = rates[pair];
  const amount = parseFloat(depositAmount);
  const errors: FormikErrors<Values> = {};

  // Deposit Amount
  if (amount <= min) {
    errors.depositAmount = `The minimum amount you can deposit is ${min}.`;
  }

  if (amount >= maxLimit) {
    errors.depositAmount = `The maximum amount you can deposit is ${maxLimit}.`;
  }

  return errors;
};

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

  props.setTouched({
    depositAmount: true,
    withdrawAmount: true
  });
  props.setFieldValue(otherFieldName, amount);
  props.handleChange(e);
};

const handleAssetSelect = (e: React.ChangeEvent<any>, props: any) => {
  const { target: { name, value } } = e;
  const previousValue = props.values[name];
  const opposites: { [field: string]: string } = {
    deposit: 'withdraw',
    withdraw: 'deposit'
  };
  const opposite = opposites[name];
  const otherAsset = props.values[opposite];

  if (value === otherAsset) {
    props.setFieldValue(opposite, previousValue);
  }

  clearAmountFields(e, props);
  props.setTouched({
    depositAmount: false,
    withdrawAmount: false
  });
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
      validate={values => validate(values, rates)}
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
              <ErrorMessage name="depositAmount" />
              <Field
                component="select"
                name="deposit"
                onChange={(e: React.ChangeEvent<any>) => handleAssetSelect(e, props)}
              >
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
                onChange={(e: React.ChangeEvent<any>) => handleAssetSelect(e, props)}
              >
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
            </fieldset>
            <fieldset>
              <button type="button" className="btn btn-secondary" onClick={() => props.resetForm()}>
                Reset
              </button>
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
