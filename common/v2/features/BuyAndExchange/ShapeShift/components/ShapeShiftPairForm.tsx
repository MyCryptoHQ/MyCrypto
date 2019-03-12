import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors, FormikActions } from 'formik';

import { MarketPairHash } from 'v2/services';
import { AssetOption } from '../types';
import AssetSelection from './AssetSelection';
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
  assets: AssetOption[];
  onSubmit(values: Values, bag: FormikActions<Values>): void;
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

const clearAmountFields = (props: any) => {
  props.setFieldValue('depositAmount', '0.0000000');
  props.setFieldValue('withdrawAmount', '0.0000000');
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

const handleAssetSelect = (name: string, value: string, props: any) => {
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

  clearAmountFields(props);

  props.setFieldValue(name, value);
  props.setTouched({
    depositAmount: false,
    withdrawAmount: false
  });
  props.setErrors({
    depositAmount: undefined,
    withdrawAmount: undefined
  });
};

const setFixedFloat = (e: React.ChangeEvent<any>, props: any) => {
  const { target: { name, value } } = e;

  props.setFieldValue(name, parseFloat(value).toFixed(7));
};

export default function ShapeShiftPairForm({ rates, assets, onSubmit }: Props) {
  return rates && assets.length > 0 ? (
    <Formik
      initialValues={{
        deposit: assets[0].ticker,
        depositAmount: '0.0000000',
        withdraw: assets[1].ticker,
        withdrawAmount: '0.0000000'
      }}
      validate={(values: Values) => validate(values, rates)}
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
                      id="depositAmount"
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
                      onBlur={(e: React.ChangeEvent<any>) => setFixedFloat(e, props)}
                    />
                  </section>
                  <AssetSelection
                    name="deposit"
                    assets={assets}
                    value={props.values.deposit}
                    onChange={asset => {
                      handleAssetSelect('deposit', asset.ticker, props);
                    }}
                  />
                </section>
              </fieldset>
              <fieldset>
                <label htmlFor="withdraw">I want to withdraw</label>
                <section className="ShapeShiftWidget-controls">
                  <section className="ShapeShiftWidget-input-wrapper">
                    <Field
                      id="withdrawAmount"
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
                      onBlur={(e: React.ChangeEvent<any>) => setFixedFloat(e, props)}
                    />
                  </section>
                  <AssetSelection
                    name="deposit"
                    assets={assets}
                    value={props.values.withdraw}
                    onChange={asset => {
                      handleAssetSelect('withdraw', asset.ticker, props);
                    }}
                  />
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
