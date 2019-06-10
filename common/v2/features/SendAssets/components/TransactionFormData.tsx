import React, { FormEvent, useContext } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button } from '@mycrypto/ui';

import { WhenQueryExists } from 'components/renderCbs';
import { DeepPartial } from 'shared/types/util';
import translate from 'translations';
import { fetchGasPriceEstimates } from 'v2';
import { AccountContext } from 'v2/providers';
import { ExtendedAccount as IExtendedAccount, AssetBalanceObject, Asset } from 'v2/services';
// import { processFormDataToTx } from 'v2/libs/transaction/process';
import { IAsset } from 'v2/types';
import { InlineErrorMsg } from 'v2/components';

import { ISendState, ITxFields } from '../types';
import {
  AccountDropdown,
  AssetDropdown,
  AmountField,
  DataField,
  EthAddressField,
  GasLimitField,
  GasPriceField,
  GasPriceSlider,
  NonceField
} from './fields';
import {
  validateDataField,
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField
} from './validators/validators';
import './TransactionFormData.scss';
import { getAssetByUUID, getNetworkByName } from 'v2/libs';
import TransactionFeeDisplay from './displays/TransactionFeeDisplay';
import TransactionValueDisplay from './displays/TransactionValuesDisplay';

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
  transactionFields,
  onNext,
  onSubmit,
  updateState
}: Props) {
  const { accounts } = useContext(AccountContext);
  // @TODO:SEND change the data structure to get an object

  const accountAssets: AssetBalanceObject[] = accounts.flatMap(a => a.assets);

  const assets: IAsset[] = accountAssets
    .map((assetObj: AssetBalanceObject) => getAssetByUUID(assetObj.uuid))
    .filter((asset: Asset | undefined) => asset)
    .map((asset: Asset) => {
      return { symbol: asset.ticker, name: asset.name, network: asset.networkId };
    });

  return (
    <div className="SendAssetsForm">
      <Formik
        initialValues={transactionFields}
        onSubmit={(fields: ITxFields) => {
          onSubmit(fields);
          onNext();
        }}
        render={({ errors, touched, setFieldValue, values, handleChange }) => {
          const toggleAdvancedOptions = () =>
            setFieldValue('isAdvancedTransaction', !values.isAdvancedTransaction);
          return (
            <Form className="SendAssetsForm">
              {/*<React.Fragment>
                {'ITxFields123: '}
                <br />
                <pre style={{ fontSize: '0.5rem' }}>
                  {JSON.stringify(processFormDataToTx(values), null, 2)}
                </pre>
                <br />
                {'Formik Fields: '}
                <br />
                <pre style={{ fontSize: '0.75rem' }}>{JSON.stringify(values, null, 2)}</pre>
              </React.Fragment>*/}
              <QueryWarning />

              {/* Asset */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="asset" className="input-group-header">
                  {translate('X_ASSET')}
                </label>
                <Field
                  name="asset"
                  component={({ field, form }: FieldProps) => (
                    <AssetDropdown
                      name={field.name}
                      value={field.value}
                      assets={assets}
                      onSelect={option => {
                        form.setFieldValue(field.name, option);
                        form.setFieldValue('account', undefined);
                        if (option.network) {
                          fetchGasPriceEstimates(option.network).then(data => {
                            form.setFieldValue('gasEstimates', data);
                            form.setFieldValue('gasPriceSlider', data.fast);
                          });
                          form.setFieldValue('network', getNetworkByName(option.network));
                        }
                      }}
                    />
                  )}
                />
              </fieldset>
              {/* Sender Address */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="account" className="input-group-header">
                  {translate('X_ADDRESS')}
                </label>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
                      values={values}
                      name={field.name}
                      value={field.value}
                      accounts={accounts}
                      onSelect={(option: IExtendedAccount) => {
                        form.setFieldValue(field.name, option);
                        updateState({ transactionFields: { account: option } });
                      }}
                    />
                  )}
                />
              </fieldset>
              {/* Recipient Address */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="recipientAddress" className="input-group-header">
                  {translate('SEND_ADDR')}
                </label>
                <EthAddressField
                  error={errors.recipientAddress}
                  touched={touched.recipientAddress}
                  fieldName="recipientAddress"
                  placeholder="Enter an Address or Contact"
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
                <TransactionValueDisplay
                  values={values}
                  fiatAsset={{ fiat: 'USD', value: '250', symbol: '$' }}
                />
              </fieldset>
              {/* Transaction Fee */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="transactionFee" className="SendAssetsForm-fieldset-transactionFee">
                  <div>Transaction Fee</div>
                  {/* TRANSLATE THIS */}
                  <TransactionFeeDisplay
                    values={values}
                    fiatAsset={{ fiat: 'USD', value: '250', symbol: '$' }}
                  />
                  {/* TRANSLATE THIS */}
                </label>
                {!values.isAdvancedTransaction && (
                  <GasPriceSlider
                    transactionFieldValues={values}
                    handleChange={(e: string) => {
                      updateState({ transactionFields: { gasPriceSlider: e } });
                      handleChange(e);
                    }}
                    gasPrice={values.gasPriceSlider}
                    gasEstimates={values.gasEstimates}
                  />
                )}
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
                        <Field
                          name="gasPriceField"
                          validate={validateGasPriceField}
                          render={({ field, form }: FieldProps<ITxFields>) => (
                            <GasPriceField
                              onChange={(option: string) => {
                                form.setFieldValue(field.name, option);
                              }}
                              name={field.name}
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                        <label htmlFor="gasLimit">{translate('OFFLINE_STEP2_LABEL_4')}</label>
                        <Field
                          name="gasLimitField"
                          validate={validateGasLimitField}
                          render={({ field, form }: FieldProps<ITxFields>) => (
                            <GasLimitField
                              onChange={(option: string) => {
                                form.setFieldValue(field.name, option);
                              }}
                              name={field.name}
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-nonce">
                        <label htmlFor="nonce">Nonce (?)</label>
                        <Field
                          name="nonceField"
                          validate={validateNonceField}
                          render={({ field, form }: FieldProps<ITxFields>) => (
                            <NonceField
                              onChange={(option: string) => {
                                form.setFieldValue(field.name, option);
                              }}
                              name={field.name}
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="SendAssetsForm-advancedOptions-errors">
                      {errors.gasPriceField && (
                        <InlineErrorMsg>{errors.gasPriceField}</InlineErrorMsg>
                      )}
                      {errors.gasLimitField && (
                        <InlineErrorMsg>{errors.gasLimitField}</InlineErrorMsg>
                      )}
                      {errors.nonceField && <InlineErrorMsg>{errors.nonceField}</InlineErrorMsg>}
                    </div>
                    <fieldset className="SendAssetsForm-fieldset">
                      <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                      <Field
                        name="data"
                        validate={validateDataField}
                        render={({ field, form }: FieldProps<ITxFields>) => (
                          <DataField
                            onChange={(option: string) => {
                              form.setFieldValue(field.name, option);
                            }}
                            errors={errors.data}
                            name={field.name}
                            value={field.value}
                          />
                        )}
                      />
                    </fieldset>
                    <div className="SendAssetsForm-advancedOptions-content-output">
                      0 + 13000000000 * 1500000 + 20000000000 * (180000 + 53000) = 0.02416 ETH ~=
                      {/* TRANSLATE THIS */}
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
