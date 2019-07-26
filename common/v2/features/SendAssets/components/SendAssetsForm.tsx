import React, { useContext, useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '@mycrypto/ui';

import translate, { translateRaw } from 'translations';
import { ENSStatus } from 'components/AddressFieldFactory/AddressInputFactory';
import { WhenQueryExists } from 'components/renderCbs';

import { InlineErrorMsg } from 'v2/components';
import { AccountContext, getAssetByUUID } from 'v2/services/Store';
import {
  Asset,
  IAsset,
  TSymbol,
  AssetBalanceObject,
  ExtendedAccount as IExtendedAccount
} from 'v2/types';
import { fetchGasPriceEstimates } from 'v2/services/ApiService';
import { getNonce } from 'v2/services/EthService';
import { processFormDataToTx } from '../process';
import { getResolvedENSAddress } from '../../Ens';
import { IFormikFields, IStepComponentProps } from '../types';
import {
  AccountDropdown,
  AssetDropdown,
  EthAddressField,
  GasLimitField,
  GasPriceField,
  GasPriceSlider,
  NonceField
} from './fields';
import './SendAssetsForm.scss';
import {
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField
} from './validators/validators';
import TransactionFeeDisplay from './displays/TransactionFeeDisplay';
import TransactionValueDisplay from './displays/TransactionValuesDisplay';

const initialFormikState = {
  recipientAddress: undefined, // should get receiverAccount from AddressBook
  amount: null,
  account: undefined, // should be renamed senderAccount
  network: '', // Not a field move to state
  asset: {},
  txDataField: '',
  gasLimitEstimated: '2100',
  gasEstimates: {
    // Not a field, move to state
    fastest: 20,
    fast: 18,
    standard: 12,
    isDefault: false,
    safeLow: 4,
    time: Date.now(),
    chainId: 1
  },
  gasPriceSlider: '20',
  gasPriceField: '20',
  gasLimitField: '2100',
  resolvedENSAddress: '0x0', // Not a field, move to state
  recipientResolvedENSAddress: '', // Not a field, move to state
  nonceEstimated: '0', // Not a field, move to state
  nonceField: '0'
};

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_SEND_LINK')}</p>
      </div>
    }
  />
);

const SendAssetsSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Required')
    .min(0.001, 'Minimun required')
    .max(1001, 'Above the balance')
});

export default function SendAssetsForm({
  // txConfig // @TODO Use prop in case goToPrevStep or URI prefill.
  onComplete
}: IStepComponentProps) {
  const { accounts } = useContext(AccountContext);
  const [isAdvancedTransaction, setIsAdvancedTransaction] = useState(false);
  const [isGasLimitManual, setIsGasLimitManual] = useState(false); // Used to indicate that user has un-clicked the user-input gas-limit checkbox.
  const [isResolvingENSName, setIsResolvingENSName] = useState(false); // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  // @TODO:SEND change the data structure to get an object

  const accountAssets: AssetBalanceObject[] = accounts.flatMap(a => a.assets);

  const assets: IAsset[] = accountAssets
    .map((assetObj: AssetBalanceObject) => getAssetByUUID(assetObj.uuid))
    .filter((asset: Asset | undefined) => asset)
    .map((asset: Asset) => {
      return { symbol: asset.ticker as TSymbol, name: asset.name, network: asset.networkId };
    });

  return (
    <div className="SendAssetsForm">
      <Formik
        initialValues={initialFormikState}
        validationSchema={SendAssetsSchema}
        onSubmit={fields => {
          onComplete(fields);
        }}
        render={({ errors, touched, setFieldValue, values, handleChange, submitForm }) => {
          const toggleAdvancedOptions = () => {
            setIsAdvancedTransaction(!isAdvancedTransaction);
          };

          const handleGasEstimate = async () => {
            if (!values || !values.network) {
              return;
            }
            // const finalTx = processFormDataToTx(values.transactionData);
            // if (!finalTx) {
            //   return;
            // }

            // if (!values.isAdvancedTransaction) {
            //   const gas = await getGasEstimate(values.network, finalTx);
            //   setFieldValue('gasLimitEstimated', gas);
            // } else {
            //   return;
            // }
          };

          const handleENSResolve = async (name: string) => {
            if (!values || !values.network) {
              return;
            }
            setIsResolvingENSName(true);
            const resolvedAddress = (await getResolvedENSAddress(values.network, name)) || '0x0';
            setIsResolvingENSName(false);
            setFieldValue('resolvedENSAddress', resolvedAddress);
          };

          //move this to parent
          const handleFieldReset = () => {
            setFieldValue('account', undefined);
            setFieldValue('recipientAddress', '');
            setFieldValue('amount', '');
          };

          const setAmountFieldToAssetMax = () =>
            // @TODO get asset balance and subtract gas cost
            setFieldValue('amount', '1000');

          const handleNonceEstimate = async (account: IExtendedAccount) => {
            if (!values || !values.network) {
              return;
            }
            const nonce: number = await getNonce(values.network, account);
            setFieldValue('nonceEstimated', nonce.toString());
          };

          return (
            <Form className="SendAssetsForm">
              <QueryWarning />
              {/* Asset */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="asset" className="input-group-header">
                  {translate('X_ASSET')}
                </label>
                <Field
                  name="asset" // Need a way to spread option, name, symbol on sharedConfig for assets
                  component={({ field, form }: FieldProps) => (
                    <AssetDropdown
                      name={field.name}
                      value={field.value}
                      assets={assets}
                      onSelect={option => {
                        form.setFieldValue('asset', option); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                        //TODO get assetType onChange
                        handleFieldReset();
                        if (option.network) {
                          fetchGasPriceEstimates(option.network).then(data => {
                            form.setFieldValue('gasEstimates', data);
                            form.setFieldValue('gasPriceSlider', data.fast);
                          });
                          // form.setFieldValue(
                          //   'sharedConfig.assetNetwork',
                          //   getNetworkByName(option.network)
                          // );
                          // handleGasEstimate();
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
                  value={values.sharedConfig}
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
                      name={field.name}
                      value={field.value}
                      accounts={accounts}
                      onSelect={(option: IExtendedAccount) => {
                        //TODO: map account values to correct keys in sharedConfig
                        form.setFieldValue(field.name, option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                        // handleNonceEstimate(option);
                        // handleGasEstimate();
                      }}
                    />
                  )}
                />
              </fieldset>
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="recipientAddress" className="input-group-header">
                  {translate('SEND_ADDR')}
                </label>
                <EthAddressField
                  fieldName="recipientAddress"
                  handleENSResolve={handleENSResolve}
                  error={errors && errors.recipientAddress}
                  touched={touched && touched.recipientAddress}
                  chainId={values.network.chainId}
                  placeholder="Enter an Address or Contact"
                />
                <ENSStatus
                  ensAddress={values.recipientAddress}
                  isLoading={isResolvingENSName}
                  rawAddress={values.recipientResolvedENSAddress}
                  chainId={values.network ? values.network.chainId : 1}
                />
              </fieldset>
              {/* Amount */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="amount" className="input-group-header label-with-action">
                  <div>{translate('SEND_ASSETS_AMOUNT_LABEL')}</div>
                  <div className="label-action" onClick={setAmountFieldToAssetMax}>
                    {translateRaw('SEND_ASSETS_AMOUNT_LABEL_ACTION').toLowerCase()}
                  </div>
                </label>
                <Field
                  name="amount"
                  render={({ field }: FieldProps) => (
                    <Input value={field.value} placeholder={'0.00'} {...field} />
                  )}
                />
                {errors.amount && errors.amount && touched.amount && touched.amount ? (
                  <InlineErrorMsg className="SendAssetsForm-errors">{errors.amount}</InlineErrorMsg>
                ) : null}
              </fieldset>
              {/* You'll Send */}
              <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
                <label>You'll Send</label>
                <TransactionValueDisplay
                  amount={values.amount || '0.00'}
                  ticker={values.asset ? values.asset.symbol : ('ETH' as TSymbol)}
                  fiatAsset={{ ticker: 'USD' as TSymbol, exchangeRate: '250' }}
                />
              </fieldset>
              {/* Transaction Fee */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="transactionFee" className="SendAssetsForm-fieldset-transactionFee">
                  <div>Transaction Fee</div>
                  {/* TRANSLATE THIS */}
                  <TransactionFeeDisplay
                    gasLimitToUse={
                      isAdvancedTransaction && isGasLimitManual
                        ? values.gasLimitField
                        : values.gasLimitEstimated
                    }
                    gasPriceToUse={
                      isAdvancedTransaction ? values.gasPriceField : values.gasPriceSlider
                    }
                    network={values.network}
                    values={values}
                    fiatAsset={{ fiat: 'USD', value: '250', symbol: '$' }}
                  />
                  {/* TRANSLATE THIS */}
                </label>
                {!isAdvancedTransaction && (
                  <GasPriceSlider
                    transactionFieldValues={values}
                    handleChange={(e: string) => {
                      // handleGasEstimate();
                      // handleChange(e);
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
                  {isAdvancedTransaction ? 'Hide' : 'Show'} Advanced Options
                </Button>
                {isAdvancedTransaction && (
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
                          render={({ field, form }: FieldProps<IFormikFields>) => (
                            <GasPriceField
                              onChange={(option: string) => {
                                form.setFieldValue('gasPriceField', option);
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
                          render={({ field, form }: FieldProps<IFormikFields>) => (
                            <GasLimitField
                              onChange={(option: string) => {
                                form.setFieldValue('gasLimitField', option);
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
                          render={({ field, form }: FieldProps<IFormikFields>) => (
                            <NonceField
                              onChange={(option: string) => {
                                form.setFieldValue('nonceField', option);
                              }}
                              name={field.name}
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="SendAssetsForm-errors">
                      {errors &&
                        errors.gasPriceField && (
                          <InlineErrorMsg>{errors.gasPriceField}</InlineErrorMsg>
                        )}
                      {errors &&
                        errors.gasLimitField && (
                          <InlineErrorMsg>{errors.gasLimitField}</InlineErrorMsg>
                        )}
                      {errors &&
                        errors.nonceField && <InlineErrorMsg>{errors.nonceField}</InlineErrorMsg>}
                    </div>
                    <fieldset className="SendAssetsForm-fieldset">
                      <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                      {/*<Field
                        name="txDataField"
                        validate={validateDataField}
                        render={({ field, form }: FieldProps<IFormikFields>) => (
                          <DataField
                            onChange={(option: string) => {
                              form.setFieldValue('txDataField', option);
                            }}
                            errors={errors.txDataField}
                            name={field.name}
                            value={field.value}
                          />
                        )}
                      />*/}
                    </fieldset>
                    <div className="SendAssetsForm-advancedOptions-content-output">
                      0 + 13000000000 * 1500000 + 20000000000 * (180000 + 53000) = 0.02416 ETH ~=
                      {/* TRANSLATE THIS */}
                      $2.67 USD{/* TRANSLATE THIS */}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                onClick={() => {
                  submitForm();
                }}
                className="SendAssetsForm-next"
              >
                Next{/* TRANSLATE THIS */}
              </Button>
            </Form>
          );
        }}
      />
    </div>
  );
}
