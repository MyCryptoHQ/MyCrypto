import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mycrypto/ui';
import isEmpty from 'lodash/isEmpty';
import { bigNumberify } from 'ethers/utils';
import BN from 'bn.js';
import styled from 'styled-components';
import path from 'ramda/src/path';
import mergeDeepWith from 'ramda/src/mergeDeepWith';
import { ValuesType } from 'utility-types';

import translate, { translateRaw } from '@translations';
import {
  AccountDropdown,
  AmountInput,
  AssetSelector,
  Checkbox,
  ContactLookupField,
  InlineMessage,
  Tooltip,
  WhenQueryExists
} from '@components';
import {
  getAccountBalance,
  getAccountsByAsset,
  getBaseAssetByNetwork,
  getNetworkById,
  SettingsContext,
  StoreContext
} from '@services/Store';
import {
  Asset,
  ErrorObject,
  IAccount,
  IFormikFields,
  InlineMessageType,
  IStepComponentProps,
  ITxConfig,
  Network,
  StoreAccount,
  StoreAsset,
  TTicker,
  WalletId
} from '@types';
import {
  baseToConvertedUnit,
  bigNumGasPriceToViewableGwei,
  convertedToBaseUnit,
  fromTokenBase,
  gasStringsToMaxGasBN,
  getNonce,
  hexToNumber,
  isBurnAddress,
  isValidETHAddress,
  isValidPositiveNumber,
  toTokenBase
} from '@services/EthService';
import { fetchGasPriceEstimates, getGasEstimate } from '@services/ApiService';
import {
  DEFAULT_ASSET_DECIMAL,
  DEFAULT_NETWORK,
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from '@config';
import { RatesContext } from '@services/RatesProvider';
import TransactionFeeDisplay from '@components/TransactionFlow/displays/TransactionFeeDisplay';
import { formatSupportEmail, isFormValid as checkFormValid, ETHUUID, isSameAddress } from '@utils';
import { checkFormForProtectTxErrors } from '@features/ProtectTransaction';
import { ProtectTxShowError } from '@features/ProtectTransaction/components/ProtectTxShowError';
import { ProtectTxButton } from '@features/ProtectTransaction/components/ProtectTxButton';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { useEffectOnce } from '@vendor';
import { getFiat } from '@config/fiats';

import { DataField, GasLimitField, GasPriceField, GasPriceSlider, NonceField } from './fields';
import './SendAssetsForm.scss';
import {
  validateAmountField,
  validateDataField,
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField
} from './validators';
import { isERC20Tx, processFormForEstimateGas } from '../helpers';
import { validateTxFee } from '@services/EthService/validators';

export const AdvancedOptionsButton = styled(Button)`
  width: 100%;
  color: #1eb8e7;
  text-align: center;
`;

const NoMarginCheckbox = styled(Checkbox)`
  margin-bottom: 0;
`;

const initialFormikValues: IFormikFields = {
  address: {
    value: '',
    display: ''
  },
  amount: '',
  account: {} as StoreAccount, // should be renamed senderAccount
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
export const getInitialFormikValues = (
  s: ITxConfig,
  defaultAsset: Asset | undefined,
  defaultNetwork: Network | undefined
): IFormikFields => {
  const gasPriceInGwei =
    path(['rawTransaction', 'gasPrice'], s) &&
    bigNumGasPriceToViewableGwei(bigNumberify(s.rawTransaction.gasPrice));
  const state: Partial<IFormikFields> = {
    amount: s.amount,
    account: s.senderAccount,
    network: s.network || defaultNetwork,
    asset: s.asset || defaultAsset,
    nonceField: s.nonce,
    txDataField: s.data,
    address: { value: s.receiverAddress, display: s.receiverAddress },
    gasLimitField: s.gasLimit && hexToNumber(s.gasLimit).toString(),
    gasPriceSlider: gasPriceInGwei,
    gasPriceField: gasPriceInGwei
  };

  const preferValueFromState = (l: FieldValue, r: FieldValue): FieldValue => (isEmpty(r) ? l : r);
  return mergeDeepWith(preferValueFromState, initialFormikValues, state);
};

const QueryWarning: React.FC = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_SEND_LINK')}</p>
      </div>
    }
  />
);

const SendAssetsForm = ({ txConfig, onComplete }: IStepComponentProps) => {
  const { accounts, userAssets, networks, getAccount, isMyCryptoMember } = useContext(StoreContext);
  const { getAssetRate, getRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);
  const [isEstimatingGasLimit, setIsEstimatingGasLimit] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isEstimatingNonce, setIsEstimatingNonce] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isResolvingName, setIsResolvingDomain] = useState(false); // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  const defaultNetwork = networks.find((n) => n.id === DEFAULT_NETWORK);
  const [baseAsset, setBaseAsset] = useState(
    (txConfig.network &&
      getBaseAssetByNetwork({ network: txConfig.network, assets: userAssets })) ||
      (defaultNetwork && getBaseAssetByNetwork({ network: defaultNetwork, assets: userAssets })) ||
      ({} as Asset)
  );

  const {
    protectTxFeatureFlag,
    state: ptxState,
    updateFormValues,
    goToInitialStepOrFetchReport,
    showHideProtectTx
  } = useContext(ProtectTxContext);

  const SendAssetsSchema = Yup.object().shape({
    amount: Yup.string()
      .required(translateRaw('REQUIRED'))
      .test('check-valid-amount', translateRaw('ERROR_0'), (value) => !validateAmountField(value))
      .test({
        name: 'check-amount',
        test(value) {
          try {
            const account = this.parent.account;
            const asset = this.parent.asset;
            if (!isEmpty(account)) {
              const balance = getAccountBalance(account, asset.type === 'base' ? undefined : asset);
              const amount = bigNumberify(toTokenBase(value, asset.decimal).toString());
              if (balance.lt(amount)) {
                return this.createError({
                  message: translateRaw('BALANCE_TOO_LOW_ERROR', {
                    $asset: this.parent.asset.ticker
                  })
                });
              }
            }
          } catch (err) {
            return false;
          }
          return true;
        }
      }),
    account: Yup.object().required(translateRaw('REQUIRED')),
    address: Yup.object()
      .required(translateRaw('REQUIRED'))
      // @ts-ignore Hack as Formik doesn't officially support warnings
      // tslint:disable-next-line
      .test('check-sending-to-burn', translateRaw('SENDING_TO_BURN_ADDRESS'), function (value) {
        if (isBurnAddress(value.value)) {
          return {
            name: 'ValidationError',
            type: InlineMessageType.INFO_CIRCLE,
            message: translateRaw('SENDING_TO_BURN_ADDRESS')
          };
        }
        return true;
      })
      // @ts-ignore Hack as Formik doesn't officially support warnings
      .test('check-sending-to-yourself', translateRaw('SENDING_TO_YOURSELF'), function (value) {
        const account = this.parent.account;
        if (
          !isEmpty(account) &&
          value.value !== undefined &&
          isSameAddress(account.address, value.value)
        ) {
          return {
            name: 'ValidationError',
            type: InlineMessageType.INFO_CIRCLE,
            message: translateRaw('SENDING_TO_YOURSELF')
          };
        }
        return true;
      }),
    gasLimitField: Yup.number()
      .min(GAS_LIMIT_LOWER_BOUND, translateRaw('ERROR_8'))
      .max(GAS_LIMIT_UPPER_BOUND, translateRaw('ERROR_8'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_8')),
    gasPriceField: Yup.number()
      .min(GAS_PRICE_GWEI_LOWER_BOUND, translateRaw('ERROR_10'))
      .max(GAS_PRICE_GWEI_UPPER_BOUND, translateRaw('ERROR_10'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('GASPRICE_ERROR')),
    nonceField: Yup.number()
      .integer(translateRaw('ERROR_11'))
      .min(0, translateRaw('ERROR_11'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_11'))
      .test(
        'check-nonce',
        // @ts-ignore Hack to allow for returning of Markdown
        translate('NONCE_ERROR', { $link: formatSupportEmail('Send Page: Nonce Error') }),
        // @ts-ignore Hack to allow for returning of Markdown
        async function (value) {
          const account = this.parent.account;
          const network = this.parent.network;
          if (!isEmpty(account)) {
            const nonce = await getNonce(network, account.address);
            return Math.abs(value - nonce) < 10;
          }
          return true;
        }
      )
  });

  const getTxFeeValidation = useCallback(
    (
      amount: string,
      assetRate: number,
      isERC20: boolean,
      gasLimit: string,
      gasPrice: string,
      ethAssetRate?: number
    ) => {
      const { type, amount: $amount, fee: $fee } = validateTxFee(
        amount,
        assetRate,
        isERC20,
        gasLimit,
        gasPrice,
        ethAssetRate
      );
      switch (type) {
        case 'Warning':
          return (
            <InlineMessage
              type={InlineMessageType.WARNING}
              value={translateRaw('WARNING_TRANSACTION_FEE', {
                $amount: `$${$amount}`,
                $fee: `$${$fee}`
              })}
            />
          );
        case 'Error-Use-Lower':
          return (
            <InlineMessage
              type={InlineMessageType.ERROR}
              value={translateRaw('ERROR_TRANSACTION_FEE_USE_LOWER', { $fee: `$${$fee}` })}
            />
          );
        case 'Error-High-Tx-Fee':
          return (
            <InlineMessage
              type={InlineMessageType.ERROR}
              value={translateRaw('ERROR_HIGH_TRANSACTION_FEE_HIGH', { $fee: `$${$fee}` })}
            />
          );
        case 'Error-Very-High-Tx-Fee':
          return (
            <InlineMessage
              type={InlineMessageType.ERROR}
              value={translateRaw('ERROR_HIGH_TRANSACTION_FEE_VERY_HIGH', { $fee: `$${$fee}` })}
            />
          );
        case 'Invalid':
        case 'None':
        default:
          return <></>;
      }
    },
    []
  );

  const validAccounts = accounts.filter((account) => account.wallet !== WalletId.VIEW_ONLY);
  const userAccountEthAsset = userAssets.find((a) => a.uuid === ETHUUID);

  return (
    <div>
      <Formik
        initialValues={getInitialFormikValues(txConfig, userAccountEthAsset, defaultNetwork)}
        validationSchema={SendAssetsSchema}
        onSubmit={(fields) => {
          onComplete(fields);
        }}
        render={({ errors, setFieldValue, setFieldTouched, touched, values }) => {
          useEffect(() => {
            if (updateFormValues) {
              updateFormValues(values);
            }
          }, [values]);

          // Set gas estimates if default asset is selected
          useEffectOnce(() => {
            if (!isEmpty(values.asset)) {
              fetchGasPriceEstimates(values.network).then((data) => {
                setFieldValue('gasEstimates', data);
                setFieldValue('gasPriceSlider', data.fast);
              });
            }
          });

          useEffect(() => {
            if (ptxState.protectTxShow) {
              if (
                goToInitialStepOrFetchReport &&
                ptxState.receiverAddress !== values.address.value
              ) {
                const { address, network } = values;
                goToInitialStepOrFetchReport(address.value, network);
              }
            }
          }, [values.address.value]);

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
              setFieldValue('gasLimitField', hexToNumber(gas).toString());
              setFieldTouched('amount');
              setIsEstimatingGasLimit(false);
            } else {
              return;
            }
          };

          const handleFieldReset = () => {
            const resetFields: (keyof IFormikFields)[] = [
              'account',
              'amount',
              'txDataField',
              'advancedTransaction'
            ];
            resetFields.forEach((field) => setFieldValue(field, initialFormikValues[field]));
          };

          const setAmountFieldToAssetMax = () => {
            const account = getAccount(values.account);
            if (values.asset && account && baseAsset) {
              const accountBalance = getAccountBalance(account, values.asset).toString();
              const isERC20 = isERC20Tx(values.asset);
              const balance = fromTokenBase(new BN(accountBalance), values.asset.decimal);
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

          const handleNonceEstimate = async (account: IAccount) => {
            if (!values || !values.network || !account) {
              return;
            }
            setIsEstimatingNonce(true);
            const nonce: number = await getNonce(values.network, account.address);
            setFieldValue('nonceField', nonce.toString());
            setIsEstimatingNonce(false);
          };

          const isFormValid = checkFormValid(errors);

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
                    <AssetSelector
                      selectedAsset={field.value}
                      assets={userAssets}
                      onSelect={(option: StoreAsset) => {
                        form.setFieldValue('asset', option || {}); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                        //@todo get assetType onChange
                        handleFieldReset();
                        if (option && option.networkId) {
                          const network = getNetworkById(option.networkId, networks);
                          fetchGasPriceEstimates(network).then((data) => {
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
                  <div>
                    {translate('X_SENDER')} <Tooltip tooltip={translateRaw('SENDER_TOOLTIP')} />
                  </div>
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
                        onSelect={(option: StoreAccount) => {
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
                <ContactLookupField
                  name="address"
                  value={values.address}
                  error={
                    errors && touched.address && errors.address && (errors.address as ErrorObject)
                  }
                  network={values.network}
                  isResolvingName={isResolvingName}
                  onBlur={handleGasEstimate}
                  setIsResolvingDomain={setIsResolvingDomain}
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
                        {errors && errors.amount && touched && touched.amount && (
                          <InlineMessage>{errors.amount}</InlineMessage>
                        )}
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
                      fiat: getFiat(settings).code,
                      rate: (getAssetRate(baseAsset || undefined) || 0).toString(),
                      symbol: getFiat(settings).symbol
                    }}
                  />
                </label>
                {!values.advancedTransaction && (
                  <GasPriceSlider
                    network={values.network}
                    gasPrice={values.gasPriceSlider}
                    gasEstimates={values.gasEstimates}
                  />
                )}
                {getTxFeeValidation(
                  values.amount,
                  getAssetRate(baseAsset || undefined) || 0,
                  isERC20Tx(values.asset),
                  values.gasLimitField.toString(),
                  values.advancedTransaction
                    ? values.gasPriceField.toString()
                    : values.gasPriceSlider.toString(),
                  getRate('ETH' as TTicker)
                )}
              </fieldset>
              {/* Advanced Options */}
              <div className="SendAssetsForm-advancedOptions">
                <AdvancedOptionsButton basic={true} onClick={toggleAdvancedOptions}>
                  {values.advancedTransaction ? translateRaw('HIDE') : translateRaw('SHOW')}{' '}
                  {translate('ADVANCED_OPTIONS_LABEL')}
                </AdvancedOptionsButton>
                {values.advancedTransaction && (
                  <div className="SendAssetsForm-advancedOptions-content">
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-limit">
                        <label htmlFor="gasLimit" className="input-group-header label-with-action">
                          <div>
                            {translate('OFFLINE_STEP2_LABEL_4')}
                            <Tooltip tooltip={translate('GAS_LIMIT_TOOLTIP')} />
                          </div>
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
                          render={({ field, form }: FieldProps<string>) => (
                            <GasLimitField
                              onChange={(option: string) => {
                                form.setFieldValue('gasLimitField', option);
                              }}
                              name={field.name}
                              value={field.value}
                              disabled={values.isAutoGasSet}
                              error={errors && errors.gasLimitField}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-price">
                        <label htmlFor="gasPrice">
                          {translate('OFFLINE_STEP2_LABEL_3')}
                          <Tooltip tooltip={translate('GAS_PRICE_TOOLTIP')} />
                        </label>
                        <Field
                          name="gasPriceField"
                          validate={validateGasPriceField}
                          render={({ field, form }: FieldProps<string>) => (
                            <GasPriceField
                              onChange={(option: string) => {
                                form.setFieldValue('gasPriceField', option);
                              }}
                              name={field.name}
                              value={field.value}
                              error={errors && errors.gasPriceField}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                      <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-nonce">
                        <label htmlFor="nonce">
                          <div>
                            {translateRaw('NONCE')} <Tooltip tooltip={translate('NONCE_TOOLTIP')} />
                          </div>
                        </label>
                        <Field
                          name="nonceField"
                          validate={validateNonceField}
                          render={({ field, form }: FieldProps<string>) => (
                            <NonceField
                              onChange={(option: string) => {
                                form.setFieldValue('nonceField', option);
                              }}
                              name={field.name}
                              value={field.value}
                              error={errors && errors.nonceField}
                            />
                          )}
                        />
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
                              render={({ field, form }: FieldProps<string>) => (
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

              {protectTxFeatureFlag && (
                <ProtectTxButton
                  reviewReport={ptxState.protectTxEnabled}
                  onClick={(e) => {
                    e.preventDefault();

                    if (goToInitialStepOrFetchReport) {
                      const { address, network } = values;
                      goToInitialStepOrFetchReport(address.value, network);
                    }

                    if (showHideProtectTx) {
                      showHideProtectTx(true);
                    }
                  }}
                />
              )}

              <Button
                type="submit"
                onClick={() => {
                  if (isFormValid) {
                    onComplete(values);
                  }
                }}
                disabled={
                  isEstimatingGasLimit || isResolvingName || isEstimatingNonce || !isFormValid
                }
                className="SendAssetsForm-next"
              >
                {translate('ACTION_6')}
              </Button>

              {protectTxFeatureFlag && (
                <ProtectTxShowError
                  protectTxError={checkFormForProtectTxErrors(
                    values,
                    getAssetRate(values.asset),
                    isMyCryptoMember
                  )}
                  shown={
                    !(isEstimatingGasLimit || isResolvingName || isEstimatingNonce || !isFormValid)
                  }
                />
              )}
            </Form>
          );
        }}
      />
    </div>
  );
};

export default SendAssetsForm;
