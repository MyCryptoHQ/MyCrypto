import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik';

import { MarketPairHash } from 'v2/services/types';
import './ShapeShiftPairForm.scss';

// Legacy
import { Warning } from 'components/ui';

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
    errors.depositAmount = `The minimum amount you can deposit is ${min} ${deposit}.`;
  }

  if (amount >= maxLimit) {
    errors.depositAmount = `The maximum amount you can deposit is ${maxLimit} ${deposit}.`;
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
  const amount = (value * rate).toFixed(7).toString();

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
  props.setErrors({
    depositAmount: undefined,
    withdrawAmount: undefined
  });
  props.handleChange(e);
};

export default function ShapeShiftPairForm({ rates, options, onSubmit }: Props) {
  return rates ? (
    <Formik
      initialValues={{
        deposit: options[0],
        depositAmount: '0.0000000',
        withdraw: options[1],
        withdrawAmount: '0.0000000'
      }}
      validate={values => validate(values, rates)}
      onSubmit={onSubmit}
      render={props => {
        return (
          <section className="ShapeShiftWidget">
            <Form>
              <fieldset className="dark">
                <label htmlFor="deposit">I want to deposit</label>
                <section className="ShapeShiftWidget-controls">
                  <section className="ShapeShiftWidget-input-wrapper">
                    <Field
                      name="depositAmount"
                      className="ShapeShiftWidget-input"
                      type="number"
                      step="any"
                      min="0.0000000"
                      onChange={(e: React.ChangeEvent<any>) =>
                        changeOtherAmountField(
                          e,
                          props,
                          rates,
                          ['deposit', 'withdraw'],
                          'withdrawAmount'
                        )
                      }
                    />
                  </section>
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
                </section>
              </fieldset>
              <fieldset>
                <label htmlFor="withdraw">I want to withdraw</label>
                <section className="ShapeShiftWidget-controls">
                  <section className="ShapeShiftWidget-input-wrapper">
                    <Field
                      name="withdrawAmount"
                      className="ShapeShiftWidget-input"
                      type="number"
                      step="any"
                      min="0.0000000"
                      onChange={(e: React.ChangeEvent<any>) =>
                        changeOtherAmountField(
                          e,
                          props,
                          rates,
                          ['withdraw', 'deposit'],
                          'depositAmount'
                        )
                      }
                    />
                  </section>
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
                </section>
              </fieldset>
              <fieldset>
                <button type="submit" className="btn ShapeShiftWidget-button">
                  Continue
                </button>
              </fieldset>
            </Form>
            {props.touched.depositAmount &&
              props.errors.depositAmount && (
                <Warning highlighted={true}>
                  <ErrorMessage name="depositAmount" />
                </Warning>
              )}
          </section>
        );
      }}
    />
  ) : (
    <p>Loading...</p>
  );
}
