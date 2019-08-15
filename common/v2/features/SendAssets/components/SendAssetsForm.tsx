import React, { useContext, useState } from 'react';
import { Field, FieldProps, Form, Formik, FastField } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '@mycrypto/ui';
import _ from 'lodash';

import translate, { translateRaw } from 'translations';
import { WhenQueryExists } from 'components/renderCbs';
import { InlineErrorMsg } from 'v2/components';
import {
  AccountContext,
  getAssetByUUID,
  getBaseAssetFromAccount,
  getNetworkByName,
  getBaseAssetByNetwork
} from 'v2/services/Store';
import { Asset, Network, AssetBalanceObject, ExtendedAccount as IExtendedAccount } from 'v2/types';
import { getNonce, hexToNumber, getResolvedENSAddress } from 'v2/services/EthService';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';
import { notUndefined } from 'v2/utils';

import TransactionFeeDisplay from './displays/TransactionFeeDisplay';
import {
  AccountDropdown,
  AssetDropdown,
  EthAddressField,
  GasLimitField,
  GasPriceField,
  GasPriceSlider,
  NonceField,
  DataField
} from './fields';
import './SendAssetsForm.scss';
import {
  // validateDataField, //Re-add this soontm
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField,
  validateDataField
} from './validators/validators';
import { IFormikFields, IStepComponentProps } from '../types';
import { processFormForEstimateGas, isERC20Tx } from '../helpers';
import {
  gasStringsToMaxGasBN,
  convertedToBaseUnit,
  baseToConvertedUnit
} from 'v2/services/EthService/utils/units';
import BN from 'bn.js';

const initialFormikValues: IFormikFields = {
  receiverAddress: {
    value: '',
    display: ''
  },
  amount: '0',
  account: {} as IExtendedAccount, // should be renamed senderAccount
  network: {} as Network, // Not a field move to state
  asset: {} as Asset,
  txDataField: '',
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
  gasLimitField: '21000',
  advancedTransaction: false,
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
  amount: Yup.number().required('Required')
});

export default function SendAssetsForm({
  // txConfig // @TODO Use prop in case goToPrevStep or URI prefill.
  onComplete
}: IStepComponentProps) {
  const { accounts } = useContext(AccountContext);

  // @ts-ignore while waiting to update form
  const [isEstimatingGasLimit, setIsEstimatingGasLimit] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isEstimatingNonce, setIsEstimatingNonce] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isResolvingENSName, setIsResolvingENSName] = useState(false); // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  // @ts-ignore while waiting to update form
  const [baseAsset, setBaseAsset] = useState({} as Asset);
  // @TODO:SEND change the data structure to get an object

  const accountAssets: AssetBalanceObject[] = accounts.flatMap(a => a.assets);
  const tokenAssets: Asset[] = accountAssets
    .map((assetObj: AssetBalanceObject) => getAssetByUUID(assetObj.uuid))
    .filter((asset: Asset | undefined) => asset)
    .map((asset: Asset) => asset);

  const baseAssets: Asset[] = accounts
    .map(account => getBaseAssetFromAccount(account))
    .filter((asset: Asset | undefined) => asset)
    .map((asset: Asset) => asset);

  const filteredAssets: string[] = _.union(
    tokenAssets.map(token => token.uuid),
    baseAssets.map(asset => asset.uuid)
  );

  const allAssets: Asset[] = filteredAssets
    .map(assetName => getAssetByUUID(assetName))
    .filter(notUndefined);

  return (
    <div className="SendAssetsForm">
      <Formik
        initialValues={initialFormikValues}
        validationSchema={SendAssetsSchema}
        onSubmit={fields => {
          onComplete(fields);
        }}
        render={({ errors, touched, setFieldValue, values, handleChange, submitForm }) => {
          const toggleAdvancedOptions = () => {
            setFieldValue('advancedTransaction', !values.advancedTransaction);
          };

          const handleGasEstimate = async () => {
            if (
              !(
                !values ||
                !values.network ||
                !values.asset ||
                !values.receiverAddress ||
                !values.account
              )
            ) {
              const finalTx = processFormForEstimateGas(values);
              const gas = await getGasEstimate(values.network, finalTx);
              setFieldValue('gasLimitField', hexToNumber(gas));
            } else {
              return;
            }
          };

          const handleENSResolve = async (name: string) => {
            if (!values || !values.network) {
              return;
            }
            setIsResolvingENSName(true);
            const resolvedAddress = (await getResolvedENSAddress(values.network, name)) || '0x0';
            setIsResolvingENSName(false);
            setFieldValue('receiverAddress', { ...values.receiverAddress, value: resolvedAddress });
          };

          const handleFieldReset = () => {
            setFieldValue('account', undefined);
          };

          const setAmountFieldToAssetMax = () => {
            if (values.asset && values.account && baseAsset) {
              const isERC20 = isERC20Tx(values.asset);
              const balance = isERC20
                ? values.account.assets
                    .filter(accountAsset => accountAsset.uuid === values.asset.uuid)
                    .map(accountAsset => accountAsset.balance)[0] || '0'
                : values.account.balance;

              if (balance === '0') {
                return;
              }
              const gasPrice = values.advancedTransaction
                ? values.gasPriceField
                : values.gasPriceSlider;
              const amount: string = isERC20 // subtract gas cost from balance when sending a base asset
                ? balance
                : baseToConvertedUnit(
                    new BN(convertedToBaseUnit(balance, 18))
                      .sub(gasStringsToMaxGasBN(gasPrice, values.gasLimitField))
                      .toString(),
                    18
                  );
              setFieldValue('amount', amount.toString());
              handleGasEstimate();
            }
          };

          const handleNonceEstimate = async (account: IExtendedAccount) => {
            if (!values || !values.network || !account) {
              return;
            }
            setIsEstimatingNonce(true);
            const nonce: number = await getNonce(values.network, account);
            setFieldValue('nonceField', nonce.toString());
            setIsEstimatingNonce(false);
          };

          return (
            <Form className="SendAssetsForm">
              <QueryWarning />
              {/* Asset */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="asset" className="input-group-header">
                  {translate('X_ASSET')}
                </label>
                <FastField
                  name="asset" // Need a way to spread option, name, symbol on sharedConfig for assets
                  component={({ field, form }: FieldProps) => (
                    <AssetDropdown
                      name={field.name}
                      value={field.value}
                      assets={allAssets}
                      onSelect={option => {
                        form.setFieldValue('asset', option); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                        //TODO get assetType onChange
                        handleFieldReset();
                        if (option.networkId) {
                          fetchGasPriceEstimates(option.networkId).then(data => {
                            form.setFieldValue('gasEstimates', data);
                            form.setFieldValue('gasPriceSlider', data.fast);
                          });
                          const network = getNetworkByName(option.networkId);
                          form.setFieldValue('network', network || {});
                          if (network) {
                            setBaseAsset(getBaseAssetByNetwork(network) || ({} as Asset));
                          }
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
                <FastField
                  name="account"
                  value={values.account}
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
                      name={field.name}
                      value={field.value}
                      asset={form.values.asset}
                      baseAsset={baseAsset}
                      network={form.values.network}
                      accounts={accounts}
                      onSelect={(option: IExtendedAccount) => {
                        //TODO: map account values to correct keys in sharedConfig
                        form.setFieldValue('account', option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                        handleNonceEstimate(option);
                        handleGasEstimate();
                      }}
                    />
                  )}
                />
              </fieldset>
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="receiverAddress" className="input-group-header">
                  {translate('SEND_ADDR')}
                </label>
                <EthAddressField
                  fieldName="receiverAddress.display"
                  handleENSResolve={handleENSResolve}
                  error={errors && errors.receiverAddress && errors.receiverAddress.value}
                  touched={touched && touched.receiverAddress && touched.receiverAddress.value}
                  handleGasEstimate={handleGasEstimate}
                  network={values.network}
                  isLoading={isResolvingENSName}
                  placeholder="Enter an Address or Contact"
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
                <FastField
                  name="amount"
                  render={({ field }: FieldProps) => (
                    <Input
                      {...field}
                      value={field.value}
                      onBlur={handleGasEstimate}
                      placeholder={'0.00'}
                    />
                  )}
                />
                {errors.amount && errors.amount && touched.amount && touched.amount ? (
                  <InlineErrorMsg className="SendAssetsForm-errors">{errors.amount}</InlineErrorMsg>
                ) : null}
              </fieldset>
              {/* You'll Send */}
              {/* <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
                <label>You'll Send</label>
                <TransactionValueDisplay
                  amount={values.amount || '0.00'}
                  ticker={
                    values.asset && values.asset.ticker
                      ? (values.asset.ticker as TSymbol)
                      : ('ETH' as TSymbol)
                  }
                  fiatAsset={{ ticker: 'USD' as TSymbol, exchangeRate: '250' }}
                />
              </fieldset> */}
              {/* Transaction Fee */}
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="transactionFee" className="SendAssetsForm-fieldset-transactionFee">
                  <div>Transaction Fee</div>
                  {/* TRANSLATE THIS */}
                  <TransactionFeeDisplay
                    baseAsset={baseAsset}
                    gasLimitToUse={values.gasLimitField}
                    gasPriceToUse={
                      values.advancedTransaction ? values.gasPriceField : values.gasPriceSlider
                    }
                    fiatAsset={{ fiat: 'USD', value: '250', symbol: '$' }}
                  />
                  {/* TRANSLATE THIS */}
                </label>
                {!values.advancedTransaction && (
                  <GasPriceSlider
                    handleChange={(e: string) => {
                      handleGasEstimate();
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
                  {values.advancedTransaction ? 'Hide' : 'Show'} Advanced Options
                </Button>
                {values.advancedTransaction && (
                  <div className="SendAssetsForm-advancedOptions-content">
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-price">
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
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-limit">
                        <label htmlFor="gasLimit" className="input-group-header label-with-action">
                          <div>{translate('OFFLINE_STEP2_LABEL_4')}</div>
                          <div className="label-action" onClick={handleGasEstimate}>
                            Estimate
                          </div>
                        </label>

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
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-nonce">
                        <label htmlFor="nonce" className="input-group-header label-with-action">
                          <div>Nonce (?)</div>
                          <div
                            className="label-action"
                            onClick={() => handleNonceEstimate(values.account)}
                          >
                            Estimate
                          </div>
                        </label>

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
                      {errors && errors.gasPriceField && (
                        <InlineErrorMsg>{errors.gasPriceField}</InlineErrorMsg>
                      )}
                      {errors && errors.gasLimitField && (
                        <InlineErrorMsg>{errors.gasLimitField}</InlineErrorMsg>
                      )}
                      {errors && errors.nonceField && (
                        <InlineErrorMsg>{errors.nonceField}</InlineErrorMsg>
                      )}
                    </div>
                    <fieldset className="SendAssetsForm-fieldset">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                        <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-data">
                          <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                          <Field
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
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                onClick={() => {
                  submitForm();
                }}
                disabled={isEstimatingGasLimit || isResolvingENSName || isEstimatingNonce}
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
