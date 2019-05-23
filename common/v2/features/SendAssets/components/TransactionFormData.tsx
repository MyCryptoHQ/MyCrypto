import React, { FormEvent } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, Typography } from '@mycrypto/ui';

import { ISendState, ITxFields } from '../types';
import './TransactionFormData.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import { WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';
import {
  RecipientAddressField,
  AmountField,
  AssetField,
  SenderAddressField,
  GasPriceField,
  GasPriceSlider,
  GasLimitField,
  DataField,
  NonceField
} from './fields';
// import { processFormDataToTx } from 'v2/libs/transaction/process';
import { DeepPartial } from 'shared/types/util';
import { processFormDataToTx } from 'v2/libs/transaction/process';

interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
  onNext(): void;
  onSubmit(transactionFields: ITxFields): void;
  updateState(state: DeepPartial<ISendState>): void;
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

export default function SendAssetsForm({
  stateValues,
  transactionFields,
  onNext,
  onSubmit,
  updateState
}: Props) {
  return (
    <div className="SendAssetsForm">
      <Formik
        initialValues={transactionFields}
        onSubmit={(fields: ITxFields) => {
          onSubmit(fields);
          onNext();
        }}
        render={({ setFieldValue, values, handleChange }) => {
          const toggleAdvancedOptions = () =>
            setFieldValue('isAdvancedTransaction', !values.isAdvancedTransaction);
          const gasEstimates = {
            fastest: 20,
            fast: 18,
            standard: 12,
            isDefault: true,
            safeLow: 4
          };
          return (
            <Form className="SendAssetsForm">
              <QueryWarning />

              <React.Fragment>
                {'ITxFields: '}
                <br />
                {JSON.stringify(processFormDataToTx(values), null, 2)}
                <br />
                {'Formik Fields: '}
                <br />
                {JSON.stringify(values, null, 2)}
              </React.Fragment>
              {/* Asset */}
              <AssetField
                handleChange={(e: FormEvent<HTMLInputElement>) => {
                  updateState({ transactionFields: { asset: e.currentTarget.value } });
                  handleChange(e);
                }}
              />
              {/* Sender Address */}
              <fieldset className="SendAssetsForm-fieldset">
                <div className="input-group-header">{translate('X_ADDRESS')}</div>

                <SenderAddressField
                  handleChange={(e: FormEvent<HTMLInputElement>) => {
                    updateState({
                      transactionFields: { senderAddress: e.currentTarget.value }
                    });
                    handleChange(e);
                  }}
                />
              </fieldset>
              {/* Recipient Address */}
              <fieldset className="SendAssetsForm-fieldset">
                <div className="input-group-header">{translate('SEND_ADDR')}</div>
                <RecipientAddressField
                  handleChange={(e: FormEvent<HTMLInputElement>) => {
                    updateState({
                      transactionFields: { recipientAddress: e.currentTarget.value }
                    });
                    handleChange(e);
                  }}
                />
              </fieldset>
              {/* Amount */}
              <AmountField
                handleChange={(e: FormEvent<HTMLInputElement>) => {
                  updateState({ transactionFields: { amount: e.currentTarget.value } });
                  handleChange(e);
                }}
              />
              {/* You'll Send */}
              <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
                <label>You'll Send</label>
                <div className="SendAssetsForm-fieldset-youllSend-box">
                  <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
                    <img src={sendIcon} alt="Send" />{' '}
                    {transactionFields.amount + transactionFields.asset}
                    {/* TRANSLATE THIS */}
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
                <GasPriceSlider
                  transactionFieldValues={values}
                  gasEstimates={gasEstimates}
                  handleChange={handleChange}
                  gasPrice={values.gasPriceField}
                />
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
                  {values.isAdvancedTransaction ? 'Hide' : 'Show'} Advanced Options
                </Button>
                {values.isAdvancedTransaction && (
                  <div className="SendAssetsForm-advancedOptions-content">
                    <div className="SendAssetsForm-advancedOptions-content-automaticallyCalculate">
                      <Field name="isGasLimitManual" type="checkbox" value={true} />
                      <label htmlFor="isGasLimitManual">
                        Automatically Calculate Gas Limit{/* TRANSLATE THIS */}
                      </label>
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                        <label htmlFor="gasPrice">{translate('OFFLINE_STEP2_LABEL_3')}</label>
                        <GasPriceField
                          handleChange={(e: FormEvent<HTMLInputElement>) => {
                            updateState({
                              transactionFields: { gasPriceField: e.currentTarget.value }
                            });
                            handleChange(e);
                          }}
                          stateValues={stateValues}
                        />
                      </div>
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                        <label htmlFor="gasLimit">{translate('OFFLINE_STEP2_LABEL_4')}</label>
                        <GasLimitField
                          handleChange={(e: FormEvent<HTMLInputElement>) => {
                            updateState({
                              transactionFields: { gasLimitField: e.currentTarget.value }
                            });
                            handleChange(e);
                          }}
                          stateValues={stateValues}
                        />
                      </div>
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-nonce">
                        <label htmlFor="nonce">Nonce (?)</label>
                        <NonceField
                          handleChange={(e: FormEvent<HTMLInputElement>) => {
                            updateState({ transactionFields: { data: e.currentTarget.value } });
                            handleChange(e);
                          }}
                          stateValues={stateValues}
                        />
                      </div>
                    </div>
                    <fieldset className="SendAssetsForm-fieldset">
                      <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                      <DataField
                        handleChange={(e: FormEvent<HTMLInputElement>) => {
                          updateState({ transactionFields: { data: e.currentTarget.value } });
                          handleChange(e);
                        }}
                        values={stateValues}
                      />
                    </fieldset>
                    <div className="SendAssetsForm-advancedOptions-content-output">
                      0 + 13000000000 * 1500000 + 20000000000 * (180000 + 53000) = 0.02416 ETH ~={/* TRANSLATE THIS */}
                      $2.67 USD{/* TRANSLATE THIS */}
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" onClick={onNext} className="SendAssetsForm-next">
                Next{/* TRANSLATE THIS */}
              </Button>
            </Form>
          );
        }}
      />
    </div>
  );
}
