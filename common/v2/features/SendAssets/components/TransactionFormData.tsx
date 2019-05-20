import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, Typography } from '@mycrypto/ui';

import { SendState, TransactionFields } from '../SendAssets';
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

interface Props {
  stateValues: SendState;
  transactionFields: TransactionFields;
  onNext(): void;
  onSubmit(transactionFields: TransactionFields): void;
  updateState(state: SendState): void;
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

export default function createSendAssetsForm(
  outerProps: Pick<Props, 'transactionFields' | 'onNext' | 'updateState' | 'onSubmit'>
) {
  return (props: Pick<Props, 'stateValues'>) => {
    return (
      <SendAssetsForm
        stateValues={props.stateValues}
        transactionFields={outerProps.transactionFields}
        onNext={outerProps.onNext}
        updateState={outerProps.updateState}
        onSubmit={outerProps.onSubmit}
      />
    );
  };
}

export function SendAssetsForm({
  stateValues,
  transactionFields,
  onNext,
  onSubmit,
  updateState
}: Props) {
  return (
    <div>
      <React.Fragment>
        {'RawValues: '}
        <br />
        {JSON.stringify(stateValues.rawTransactionValues, null, 2)}
      </React.Fragment>

      <Formik
        initialValues={transactionFields}
        onSubmit={(fields: TransactionFields) => {
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
                <br />
                <br />
                <br />
                {'Formik Fields: '}
                <br />
                {JSON.stringify(values, null, 2)}
              </React.Fragment>
              {/* Asset */}
              <AssetField
                handleChange={handleChange}
                updateState={updateState}
                stateValues={stateValues}
              />
              {/* Sender Address */}
              <fieldset className="SendAssetsForm-fieldset">
                <div className="input-group-header">{translate('X_ADDRESS')}</div>
                <SenderAddressField
                  handleChange={handleChange}
                  updateState={updateState}
                  stateValues={stateValues}
                />
              </fieldset>
              {/* Recipient Address */}
              <fieldset className="SendAssetsForm-fieldset">
                <div className="input-group-header">{translate('SEND_ADDR')}</div>
                <RecipientAddressField
                  handleChange={handleChange}
                  updateState={updateState}
                  stateValues={stateValues}
                />
              </fieldset>
              {/* Amount */}
              <AmountField
                handleChange={handleChange}
                updateState={updateState}
                stateValues={stateValues}
              />
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
                <GasPriceSlider
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
                      <Field name="automaticallyCalculateGasLimit" type="checkbox" value={true} />
                      <label htmlFor="automaticallyCalculateGasLimit">
                        Automatically Calculate Gas Limit{/* TRANSLATE THIS */}
                      </label>
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                        <label htmlFor="gasPrice">{translate('OFFLINE_STEP2_LABEL_3')}</label>
                        <GasPriceField
                          handleChange={handleChange}
                          updateState={updateState}
                          stateValues={stateValues}
                        />
                      </div>
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                        <label htmlFor="gasLimit">{translate('OFFLINE_STEP2_LABEL_4')}</label>
                        <GasLimitField
                          handleChange={handleChange}
                          updateState={updateState}
                          stateValues={stateValues}
                        />
                      </div>
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-nonce">
                        <label htmlFor="nonce">Nonce (?)</label>
                        <NonceField
                          handleChange={handleChange}
                          updateState={updateState}
                          stateValues={stateValues}
                        />
                      </div>
                    </div>
                    <fieldset className="SendAssetsForm-fieldset">
                      <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                      <DataField
                        handleChange={handleChange}
                        updateState={updateState}
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
