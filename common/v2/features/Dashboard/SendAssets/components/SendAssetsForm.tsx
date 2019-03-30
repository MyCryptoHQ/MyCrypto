import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, Heading, Input, Typography } from '@mycrypto/ui';

import { Transaction } from '../SendAssets';
import './SendAssetsForm.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import { WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';
import {
  RecipientAddressField,
  AmountField,
  SenderAddressField,
  GasPriceField,
  GasLimitField,
  DataField
} from './fields';

interface Props {
  transaction: Transaction;
  onNext(): void;
  onSubmit(values: Transaction): void;
}

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_SEND_LINK')}</p>
      </div>
    }
  />
);

export default function SendAssetsForm({ transaction, onNext, onSubmit }: Props) {
  return (
    <Formik
      initialValues={transaction}
      onSubmit={values => {
        onSubmit(values);
        console.log('values: ' + JSON.stringify(values, null, 4));
        onNext();
      }}
      render={({ setFieldValue, values: { advancedMode }, handleChange }) => {
        const toggleAdvancedOptions = () => setFieldValue('advancedMode', !advancedMode);

        return (
          <Form className="SendAssetsForm">
            <QueryWarning />
            {/* Sender Address */}

            <fieldset className="SendAssetsForm-fieldset">
              <div className="input-group-header">{translate('X_ADDRESS')}</div>
              <SenderAddressField handleChange={handleChange} />
            </fieldset>
            {/* Recipient Address */}

            <fieldset className="SendAssetsForm-fieldset">
              <div className="input-group-header">{translate('SEND_ADDR')}</div>
              <RecipientAddressField />
            </fieldset>
            {/* Amount / Asset */}
            <AmountField handleChange={handleChange} />
            {/* You'll Send */}
            <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
              <label>You'll Send</label>
              <div className="SendAssetsForm-fieldset-youllSend-box">
                <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
                  <img src={sendIcon} alt="Send" /> 13.233333 ETH{/* TRANSLATE THIS */}
                </Heading>
                <small className="SendAssetsForm-fieldset-youllSend-box-fiat">
                  {/* TRANSLATE THIS */}≈ $1440.00 USD
                </small>
                <div className="SendAssetsForm-fieldset-youllSend-box-conversion">
                  <Typography>
                    Conversion Rate <br />
                    {/* TRANSLATE THIS */}
                    1 ETH ≈ $109.41 USD{/* TRANSLATE THIS */}
                  </Typography>
                </div>
              </div>
            </fieldset>
            {/* Transaction Fee */}
            <fieldset className="SendAssetsForm-fieldset">
              <label htmlFor="transactionFee" className="SendAssetsForm-fieldset-transactionFee">
                <div>Transaction Fee</div>
                {/* TRANSLATE THIS */}
                <div>0.000273 / $0.03 USD</div>
                {/* TRANSLATE THIS */}
              </label>
              <div className="SendAssetsForm-fieldset-rangeWrapper">
                <div className="SendAssetsForm-fieldset-rangeWrapper-cheap" />
                <Field name="transactionFee" type="range" min="0" max="100" />
                <div className="SendAssetsForm-fieldset-rangeWrapper-fast" />
              </div>
              <div className="SendAssetsForm-fieldset-cheapFast">
                <div>Cheap</div>
                {/* TRANSLATE THIS */}
                <div>Fast</div>
                {/* TRANSLATE THIS */}
              </div>
            </fieldset>
            {/* Advanced Options */}
            <div className="SendAssetsForm-advancedOptions">
              <Button
                basic={true}
                onClick={toggleAdvancedOptions}
                className="SendAssetsForm-advancedOptions-button"
              >
                {advancedMode ? 'Hide' : 'Show'} Advanced Options
              </Button>
              {advancedMode && (
                <div className="SendAssetsForm-advancedOptions-content">
                  <div className="SendAssetsForm-advancedOptions-content-automaticallyCalculate">
                    <Field name="automaticallyCalculateGasLimit" type="checkbox" />
                    <label htmlFor="automaticallyCalculateGasLimit">
                      Automatically Calculate Gas Limit{/* TRANSLATE THIS */}
                    </label>
                  </div>
                  <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce">
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                      <label htmlFor="gasPrice">{translate('OFFLINE_STEP2_LABEL_3')}</label>
                      <GasPriceField handleChange={handleChange} />
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                      <label htmlFor="gasLimit">{translate('OFFLINE_STEP2_LABEL_4')}</label>
                      <GasLimitField handleChange={handleChange} />
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-nonce">
                      <label htmlFor="nonce">Nonce (?)</label>
                      <Field
                        name="nonce"
                        render={({ field, form }: FieldProps<Transaction>) => (
                          <Input
                            {...field}
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="0"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <fieldset className="SendAssetsForm-fieldset">
                    <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                    <DataField handleChange={handleChange} />
                  </fieldset>
                  <div className="SendAssetsForm-advancedOptions-content-output">
                    0 + 13000000000 * 1500000 + 20000000000 * (180000 + 53000) = 0.02416 ETH ~={/* TRANSLATE THIS */}
                    $2.67 USD{/* TRANSLATE THIS */}
                  </div>
                </div>
              )}
            </div>
            <Button type="submit" className="SendAssetsForm-next">
              Next{/* TRANSLATE THIS */}
            </Button>
          </Form>
        );
      }}
    />
  );
}
