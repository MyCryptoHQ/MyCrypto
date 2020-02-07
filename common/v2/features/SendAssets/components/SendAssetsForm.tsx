import React, { useContext, useState } from 'react';
import { Field, FieldProps, Form, Formik, FastField } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mycrypto/ui';
import _, { isEmpty } from 'lodash';
import { formatEther } from 'ethers/utils';
import BN from 'bn.js';
import styled from 'styled-components';
import * as R from 'ramda';
import { ValuesType } from 'utility-types';

import questionSVG from 'assets/images/icn-question.svg';

import translate, { translateRaw } from 'v2/translations';
import {
  InlineErrorMsg,
  AccountDropdown,
  AmountInput,
  AssetDropdown,
  WhenQueryExists,
  AddressField,
  Checkbox
} from 'v2/components';
import {
  getNetworkById,
  getBaseAssetByNetwork,
  getAccountsByAsset,
  StoreContext,
  getAccountBalance
} from 'v2/services/Store';
import {
  Asset,
  Network,
  ExtendedAccount,
  StoreAsset,
  WalletId,
  IFormikFields,
  IStepComponentProps,
  ITxConfig
} from 'v2/types';
import {
  getNonce,
  hexToNumber,
  isValidETHAddress,
  gasStringsToMaxGasBN,
  convertedToBaseUnit,
  baseToConvertedUnit,
  isValidPositiveNumber
} from 'v2/services/EthService';
import UnstoppableResolution from 'v2/services/UnstoppableService';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';
import {
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND,
  DEFAULT_ASSET_DECIMAL
} from 'v2/config';
import { RatesContext } from 'v2/services/RatesProvider';

import TransactionFeeDisplay from 'v2/components/TransactionFlow/displays/TransactionFeeDisplay';
import { GasLimitField, GasPriceField, GasPriceSlider, NonceField, DataField } from './fields';
import './SendAssetsForm.scss';
import {
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField,
  validateDataField,
  validateAmountField
} from './validators/validators';
import { processFormForEstimateGas, isERC20Tx } from '../helpers';
import { weiToFloat } from 'v2/utils';
import { ResolutionError } from '@unstoppabledomains/resolution';

export const AdvancedOptionsButton = styled(Button)`
  width: 100%;
  color: #1eb8e7;
  text-align: center;
`;

const NoMarginCheckbox = styled(Checkbox)`
  margin-bottom: 0px;
`;

const initialFormikValues: IFormikFields = {
  address: {
    value: '',
    display: ''
  },
  amount: '',
  account: {} as ExtendedAccount, // should be renamed senderAccount
  network: {} as Network, // Not a field move to state
  asset: {} as StoreAsset,
  txDataField: '0x',
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
  nonceField: '0',
  isAutoGasSet: true
};

// To preserve form state between steps, we prefil the fields with state
// values when they exits.
type FieldValue = ValuesType<IFormikFields>;
export const getInitialFormikValues = (s: ITxConfig): IFormikFields => {
  const state: Partial<IFormikFields> = {
    amount: s.amount,
    account: s.senderAccount,
    network: s.network,
    asset: s.asset,
    nonceField: s.nonce,
    txDataField: s.data,
    address: { value: s.receiverAddress, display: s.receiverAddress }
  };

  const preferValueFromState = (l: FieldValue, r: FieldValue): FieldValue => (isEmpty(r) ? l : r);
  return R.mergeDeepWith(preferValueFromState, initialFormikValues, state);
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
    .min(0, translateRaw('ERROR_0'))
    .required(translateRaw('REQUIRED')),
  account: Yup.object().required(translateRaw('REQUIRED')),
  address: Yup.object().required(translateRaw('REQUIRED')),
  gasLimitField: Yup.number()
    .min(GAS_LIMIT_LOWER_BOUND, translateRaw('ERROR_8'))
    .max(GAS_LIMIT_UPPER_BOUND, translateRaw('ERROR_8'))
    .required(translateRaw('REQUIRED')),
  gasPriceField: Yup.number()
    .min(GAS_PRICE_GWEI_LOWER_BOUND, translateRaw('ERROR_10'))
    .max(GAS_PRICE_GWEI_UPPER_BOUND, translateRaw('ERROR_10'))
    .required(translateRaw('REQUIRED')),
  nonceField: Yup.number()
    .integer(translateRaw('ERROR_11'))
    .min(0, translateRaw('ERROR_11'))
    .required(translateRaw('REQUIRED'))
});

export default function SendAssetsForm({ txConfig, onComplete }: IStepComponentProps) {
  const { accounts, userAssets, networks, getAccount } = useContext(StoreContext);
  const { getAssetRate } = useContext(RatesContext);
  const [isEstimatingGasLimit, setIsEstimatingGasLimit] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isEstimatingNonce, setIsEstimatingNonce] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isResolvingName, setIsResolvingDomain] = useState(false); // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  const [baseAsset, setBaseAsset] = useState({} as Asset);
  const [resolutionError, setResolutionError] = useState<ResolutionError>();
  const validAccounts = accounts.filter(account => account.wallet !== WalletId.VIEW_ONLY);
  return (
    <div className="SendAssetsForm">
      <Formik
        initialValues={getInitialFormikValues(txConfig)}
        validationSchema={SendAssetsSchema}
        onSubmit={fields => {
          onComplete(fields);
        }}
        render={({ errors, setFieldValue, setFieldTouched, touched, values, handleChange }) => {
          const toggleAdvancedOptions = () => {
            setFieldValue('advancedTransaction', !values.advancedTransaction);
          };
          const toggleIsAutoGasSet = () => {
            // save value because setFieldValue method is async and values are not yet updated	            // save value because setFieldValue method is async and values are not yet updated
            const isEnablingAutoGas = !values.isAutoGasSet;
            setFieldValue('isAutoGasSet', !values.isAutoGasSet);
            if (isEnablingAutoGas) {
              handleGasEstimate(true);
            }
          };
          const handleGasEstimate = async (forceEstimate: boolean = false) => {
            if (
              values &&
              values.network &&
              values.asset &&
              values.address &&
              isValidETHAddress(values.address.value) &&
              values.account &&
              isValidPositiveNumber(values.amount) &&
              (values.isAutoGasSet || forceEstimate)
            ) {
              setIsEstimatingGasLimit(true);
              const finalTx = processFormForEstimateGas(values);
              const gas = await getGasEstimate(values.network, finalTx);
              setFieldValue('gasLimitField', hexToNumber(gas));
              setFieldTouched('amount');
              setIsEstimatingGasLimit(false);
            } else {
              return;
            }
          };

          const handleDomainResolve = async (name: string) => {
            if (!values || !values.network) {
              setIsResolvingDomain(false);
              setResolutionError(undefined);
              return;
            }
            setIsResolvingDomain(true);
            setResolutionError(undefined);
            try {
              const unstoppableAddress = await UnstoppableResolution.getResolvedAddress(
                name,
                values.asset.ticker
              );
              setFieldValue('address', {
                ...values.address,
                value: unstoppableAddress
              });
            } catch (err) {
              if (UnstoppableResolution.isResolutionError(err)) {
                setResolutionError(err);
              } else throw err;
            } finally {
              setIsResolvingDomain(false);
            }
          };

          const handleFieldReset = () => {
            const resetFields: (keyof IFormikFields)[] = [
              'account',
              'amount',
              'txDataField',
              'advancedTransaction'
            ];
            resetFields.forEach(field => setFieldValue(field, initialFormikValues[field]));
          };

          const setAmountFieldToAssetMax = () => {
            const account = getAccount(values.account);
            if (values.asset && account && baseAsset) {
              const isERC20 = isERC20Tx(values.asset);
              const balance = isERC20
                ? weiToFloat(
                    getAccountBalance(account, values.asset),
                    values.asset.decimal
                  ).toString()
                : formatEther(getAccountBalance(account).toString());
              const gasPrice = values.advancedTransaction
                ? values.gasPriceField
                : values.gasPriceSlider;
              const amount = isERC20 // subtract gas cost from balance when sending a base asset
                ? balance
                : baseToConvertedUnit(
                    new BN(convertedToBaseUnit(balance.toString(), DEFAULT_ASSET_DECIMAL))
                      .sub(gasStringsToMaxGasBN(gasPrice, values.gasLimitField))
                      .toString(),
                    DEFAULT_ASSET_DECIMAL
                  );
              setFieldValue('amount', amount);
              handleGasEstimate();
            }
          };

          const handleNonceEstimate = async (account: ExtendedAccount) => {
            if (!values || !values.network || !account) {
              return;
            }
            setIsEstimatingNonce(true);
            const nonce: number = await getNonce(values.network, account);
            setFieldValue('nonceField', nonce.toString());
            setIsEstimatingNonce(false);
          };

          const isValidAddress =
            !errors.address ||
            Object.values(errors.address).filter(e => e !== undefined).length === 0;
          const isValid =
            Object.values(errors).filter(error => error !== undefined && !isEmpty(error)).length ===
            0;

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
                      selectedAsset={field.value}
                      assets={userAssets}
                      onSelect={(option: StoreAsset) => {
                        form.setFieldValue('asset', option || {}); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                        //TODO get assetType onChange
                        handleFieldReset();
                        if (option && option.networkId) {
                          const network = getNetworkById(option.networkId, networks);
                          fetchGasPriceEstimates(network).then(data => {
                            form.setFieldValue('gasEstimates', data);
                            form.setFieldValue('gasPriceSlider', data.fast);
                          });
                          form.setFieldValue('network', network || {});
                          if (network) {
                            setBaseAsset(
                              getBaseAssetByNetwork({ network, assets: userAssets }) ||
                                ({} as Asset)
                            );
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
                  {translate('X_SENDER')}
                </label>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field, form }: FieldProps) => {
                    const accountsWithAsset = getAccountsByAsset(validAccounts, values.asset);
                    return (
                      <AccountDropdown
                        name={field.name}
                        value={field.value}
                        accounts={accountsWithAsset}
                        onSelect={(option: ExtendedAccount) => {
                          form.setFieldValue('account', option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                          handleNonceEstimate(option);
                          handleGasEstimate();
                        }}
                        asset={values.asset}
                      />
                    );
                  }}
                />
              </fieldset>
              <fieldset className="SendAssetsForm-fieldset">
                <label htmlFor="address" className="input-group-header">
                  {translate('X_RECIPIENT')}
                </label>
                <AddressField
                  fieldName="address"
                  handleDomainResolve={handleDomainResolve}
                  onBlur={() => handleGasEstimate()}
                  error={errors && errors.address && errors.address.value}
                  touched={touched}
                  network={values.network}
                  isLoading={isResolvingName}
                  isError={!isValidAddress}
                  resolutionError={resolutionError}
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
                <Field
                  name="amount"
                  validate={validateAmountField}
                  render={({ field, form }: FieldProps) => {
                    return (
                      <>
                        <AmountInput
                          {...field}
                          asset={values.asset}
                          value={field.value}
                          onBlur={() => {
                            form.setFieldTouched('amount');
                            handleGasEstimate();
                          }}
                          placeholder={'0.00'}
                        />
                        {errors && touched && touched.amount ? (
                          <InlineErrorMsg className="SendAssetsForm-errors">
                            {errors.amount}
                          </InlineErrorMsg>
                        ) : null}
                      </>
                    );
                  }}
                />
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
                  <div>{translate('CONFIRM_TX_FEE')}</div>
                  <TransactionFeeDisplay
                    baseAsset={baseAsset}
                    gasLimitToUse={values.gasLimitField}
                    gasPriceToUse={
                      values.advancedTransaction ? values.gasPriceField : values.gasPriceSlider
                    }
                    fiatAsset={{
                      fiat: 'USD',
                      rate: (getAssetRate(baseAsset || undefined) || 0).toString(),
                      symbol: '$'
                    }}
                  />
                  {/* TRANSLATE THIS */}
                </label>
                {!values.advancedTransaction && (
                  <GasPriceSlider
                    handleChange={(e: string) => {
                      handleGasEstimate();
                      handleChange(e);
                    }}
                    network={values.network}
                    gasPrice={values.gasPriceSlider}
                    gasEstimates={values.gasEstimates}
                  />
                )}
              </fieldset>
              {/* Advanced Options */}
              <div className="SendAssetsForm-advancedOptions">
                <AdvancedOptionsButton basic={true} onClick={toggleAdvancedOptions}>
                  {values.advancedTransaction ? 'Hide' : 'Show'}{' '}
                  {translate('ADVANCED_OPTIONS_LABEL')}
                </AdvancedOptionsButton>
                {values.advancedTransaction && (
                  <div className="SendAssetsForm-advancedOptions-content">
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-limit">
                        <label htmlFor="gasLimit" className="input-group-header label-with-action">
                          <div>{translate('OFFLINE_STEP2_LABEL_4')}</div>
                          <NoMarginCheckbox
                            onChange={toggleIsAutoGasSet}
                            checked={values.isAutoGasSet}
                            name="autoGasSet"
                            label={translateRaw('TRANS_AUTO_GAS_TOGGLE')}
                          />
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
                              disabled={values.isAutoGasSet}
                            />
                          )}
                        />
                        {errors && errors.gasLimitField && (
                          <InlineErrorMsg>{errors.gasLimitField}</InlineErrorMsg>
                        )}
                      </div>
                    </div>
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
                        {errors && errors.gasPriceField && (
                          <InlineErrorMsg>{errors.gasPriceField}</InlineErrorMsg>
                        )}
                      </div>
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-nonce">
                        <label htmlFor="nonce">
                          <div>
                            Nonce{' '}
                            <a
                              href={
                                'https://support.mycrypto.com/general-knowledge/ethereum-blockchain/what-is-nonce'
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img src={questionSVG} alt="Help" />{' '}
                            </a>
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
                        {errors && errors.nonceField && (
                          <InlineErrorMsg>{errors.nonceField}</InlineErrorMsg>
                        )}
                      </div>
                    </div>

                    {!isERC20Tx(values.asset) && (
                      <fieldset className="SendAssetsForm-fieldset">
                        <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                          <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-data">
                            <label htmlFor="data">{translate('TRANS_DATA')}</label>
                            <Field
                              name="txDataField"
                              validate={(value: string) => value !== '' && validateDataField(value)}
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
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                onClick={() => {
                  if (isValid) {
                    onComplete(values);
                  }
                }}
                disabled={isEstimatingGasLimit || isResolvingName || isEstimatingNonce || !isValid}
                className="SendAssetsForm-next"
              >
                {translate('ACTION_6')}
              </Button>
            </Form>
          );
        }}
      />
    </div>
  );
}
