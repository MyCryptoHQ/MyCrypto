import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Button as UIBtn } from '@mycrypto/ui';
import BN from 'bn.js';
import { bigNumberify } from 'ethers/utils';
import { useFormik } from 'formik';
import isEmpty from 'lodash/isEmpty';
import mergeDeepWith from 'ramda/src/mergeDeepWith';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { ValuesType } from 'utility-types';
import { number, object, string } from 'yup';

import {
  AccountSelector,
  AmountInput,
  AssetSelector,
  Button,
  Checkbox,
  ContactLookupField,
  DemoGatewayBanner,
  InlineMessage,
  Tooltip,
  WhenQueryExists
} from '@components';
import TransactionFeeDisplay from '@components/TransactionFlow/displays/TransactionFeeDisplay';
import {
  DEFAULT_ASSET_DECIMAL,
  ETHUUID,
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND,
  getWalletConfig
} from '@config';
import { Fiats, getFiat } from '@config/fiats';
import { checkFormForProtectTxErrors } from '@features/ProtectTransaction';
import { ProtectTxShowError } from '@features/ProtectTransaction/components/ProtectTxShowError';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { getNonce, useRates } from '@services';
import { fetchGasPriceEstimates, getGasEstimate } from '@services/ApiService';
import {
  isBurnAddress,
  isValidETHAddress,
  isValidPositiveNumber,
  TxFeeResponseType,
  validateTxFee
} from '@services/EthService/validators';
import {
  getAccountBalance,
  getAccountsByAsset,
  getBaseAssetByNetwork,
  getNetworkById,
  StoreContext,
  useAssets,
  useSettings
} from '@services/Store';
import { AppState, getIsDemoMode } from '@store';
import translate, { translateRaw } from '@translations';
import {
  Asset,
  ErrorObject,
  Fiat,
  IAccount,
  IFormikFields,
  InlineMessageType,
  IStepComponentProps,
  ITxConfig,
  Network,
  StoreAccount,
  StoreAsset,
  TAddress,
  TUuid,
  TxQueryTypes,
  WalletId
} from '@types';
import {
  baseToConvertedUnit,
  bigify,
  bigNumGasPriceToViewableGwei,
  isFormValid as checkFormValid,
  convertedToBaseUnit,
  formatSupportEmail,
  fromTokenBase,
  gasStringsToMaxGasBN,
  hexToNumber,
  isSameAddress,
  isVoid,
  sortByLabel,
  toTokenBase
} from '@utils';
import { path, useDebounce } from '@vendor';

import { isERC20Asset, processFormForEstimateGas } from '../helpers';
import { DataField, GasLimitField, GasPriceField, GasPriceSlider, NonceField } from './fields';
import './SendAssetsForm.scss';
import {
  validateAmountField,
  validateDataField,
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField
} from './validators';

export const AdvancedOptionsButton = styled(UIBtn)`
  width: 100%;
  color: #1eb8e7;
  text-align: center;
`;

const NoMarginCheckbox = styled(Checkbox)`
  margin-bottom: 0;
`;

const getTxFeeValidation = ({
  amount = '0',
  fiat,
  fee,
  type
}: {
  fiat: Fiat;
  amount?: string;
  fee?: string;
  type: TxFeeResponseType;
}) => {
  switch (type) {
    case 'Warning':
      return (
        <InlineMessage
          type={InlineMessageType.WARNING}
          value={translateRaw('WARNING_TRANSACTION_FEE', {
            $amount: `${fiat.symbol}${amount}`,
            $fee: `${fiat.symbol}${fee}`
          })}
        />
      );
    case 'Error-Use-Lower':
      return (
        <InlineMessage
          type={InlineMessageType.ERROR}
          value={translateRaw('ERROR_TRANSACTION_FEE_USE_LOWER', { $fee: `${fiat.symbol}${fee}` })}
        />
      );
    case 'Error-High-Tx-Fee':
      return (
        <InlineMessage
          type={InlineMessageType.ERROR}
          value={translateRaw('ERROR_HIGH_TRANSACTION_FEE_HIGH', { $fee: `${fiat.symbol}${fee}` })}
        />
      );
    case 'Error-Very-High-Tx-Fee':
      return (
        <InlineMessage
          type={InlineMessageType.ERROR}
          value={translateRaw('ERROR_HIGH_TRANSACTION_FEE_VERY_HIGH', {
            $fee: `${fiat.symbol}${fee}`
          })}
        />
      );
    case 'Invalid':
    case 'None':
    default:
      return <></>;
  }
};

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
const getInitialFormikValues = ({
  s,
  defaultAccount,
  defaultAsset,
  defaultNetwork
}: {
  s: ITxConfig;
  defaultAccount: StoreAccount;
  defaultAsset: Asset | undefined;
  defaultNetwork: Network | undefined;
}): IFormikFields => {
  const gasPriceInGwei =
    path(['rawTransaction', 'gasPrice'], s) &&
    bigNumGasPriceToViewableGwei(bigify(s.rawTransaction.gasPrice));
  const state: Partial<IFormikFields> = {
    amount: s.amount,
    account: !isVoid(s.senderAccount) ? s.senderAccount : defaultAccount,
    network: !isVoid(s.network) ? s.network : defaultNetwork,
    asset: !isVoid(s.asset) ? s.asset : defaultAsset,
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

const createQueryWarning = (translationId?: string) => (
  <div className="alert alert-info">
    <p>{translate(translationId || 'WARN_SEND_LINK')}</p>
  </div>
);

const QueryWarning = () => <WhenQueryExists displayQueryMessage={createQueryWarning} />;

interface ISendFormProps extends IStepComponentProps {
  type?: TxQueryTypes;
  protectTxButton?(): JSX.Element;
}

const SendAssetsForm = ({ txConfig, onComplete, protectTxButton, isDemoMode }: Props) => {
  const {
    accounts,
    userAssets,
    networks,
    getAccount,
    getDefaultAccount: getDefaultStoreAccount
  } = useContext(StoreContext);
  const { getAssetRate, getAssetRateInCurrency } = useRates();
  const { getAssetByUUID, assets } = useAssets();
  const { settings } = useSettings();
  const [isEstimatingGasLimit, setIsEstimatingGasLimit] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [gasEstimationError, setGasEstimationError] = useState<string | undefined>(undefined);
  const [isEstimatingNonce, setIsEstimatingNonce] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isResolvingName, setIsResolvingDomain] = useState(false); // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  const [fetchedNonce, setFetchedNonce] = useState(0);

  const EthAsset = getAssetByUUID(ETHUUID as TUuid)!;

  const validAccounts = accounts.filter((account) => account.wallet !== WalletId.VIEW_ONLY);
  const userAccountEthAsset = userAssets.find((a) => a.uuid === ETHUUID);
  const defaultAsset = (() => {
    if (userAccountEthAsset) {
      return userAccountEthAsset;
    } else if (userAssets.length > 0) {
      return userAssets[0];
    }
    return undefined;
  })();

  const getDefaultAccount = (asset?: Asset) => {
    const storeDefaultAccount = getDefaultStoreAccount(false, asset?.networkId);
    if (asset !== undefined && !storeDefaultAccount.assets.some((a) => a.uuid === asset.uuid)) {
      const accountsWithDefaultAsset = validAccounts.filter((account) =>
        account.assets.some((a) => a.uuid === asset.uuid)
      );
      if (accountsWithDefaultAsset.length > 0) {
        return sortByLabel(accountsWithDefaultAsset)[0];
      }
    }
    return storeDefaultAccount;
  };
  const getDefaultNetwork = (account: StoreAccount) =>
    networks.find((n) => n.id === account.networkId);

  const defaultAccount = getDefaultAccount(defaultAsset);
  const defaultNetwork = getDefaultNetwork(defaultAccount);
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
    goToInitialStepOrFetchReport
  } = useContext(ProtectTxContext);

  const SendAssetsSchema = object().shape({
    amount: string()
      .required(translateRaw('REQUIRED'))
      .test(validateAmountField())
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
    account: object().required(translateRaw('REQUIRED')),
    address: object()
      .required(translateRaw('REQUIRED'))
      // @ts-expect-error Hack as Formik doesn't officially support warnings
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
      // @ts-expect-error Hack as Formik doesn't officially support warnings
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
      })
      // @ts-expect-error Hack as Formik doesn't officially support warnings
      // tslint:disable-next-line
      .test('check-sending-to-token-address', translateRaw('SENDING_TO_TOKEN_ADDRESS'), function (
        value
      ) {
        const token = assets.find((a) => isSameAddress(a.contractAddress as TAddress, value.value));
        if (value.value !== undefined && token) {
          return {
            name: 'ValidationError',
            type: InlineMessageType.INFO_CIRCLE,
            message: translateRaw('SENDING_TO_TOKEN_ADDRESS', { $token: token.ticker })
          };
        }
        return true;
      }),
    gasLimitField: number()
      .min(GAS_LIMIT_LOWER_BOUND, translateRaw('ERROR_8'))
      .max(GAS_LIMIT_UPPER_BOUND, translateRaw('ERROR_8'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_8'))
      .test(validateGasLimitField()),
    gasPriceField: number()
      .min(GAS_PRICE_GWEI_LOWER_BOUND, translateRaw('LOW_GAS_PRICE_WARNING'))
      .max(GAS_PRICE_GWEI_UPPER_BOUND, translateRaw('ERROR_10'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('GASPRICE_ERROR'))
      .test(validateGasPriceField()),
    nonceField: number()
      .integer(translateRaw('ERROR_11'))
      .min(0, translateRaw('ERROR_11'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_11'))
      .test(validateNonceField())
      .test(
        'check-nonce',
        // @ts-expect-error Hack to allow for returning of Markdown
        translate('NONCE_ERROR', { $link: formatSupportEmail('Send Page: Nonce Error') }),
        async function (value) {
          const account = this.parent.account;
          if (!isEmpty(account)) {
            return Math.abs(value - fetchedNonce) < 10;
          }
          return true;
        }
      ),
    dataField: string().test(validateDataField())
  });

  const initialValues = useMemo(
    () =>
      getInitialFormikValues({
        s: txConfig,
        defaultAccount,
        defaultAsset,
        defaultNetwork
      }),
    []
  );

  const {
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    resetForm,
    errors,
    touched
  } = useFormik({
    initialValues,
    validationSchema: SendAssetsSchema,
    onSubmit: (fields) => {
      onComplete(fields);
    }
  });

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues(values);
    }
  }, [values]);

  useEffect(() => {
    handleNonceEstimate(values.account);
  }, [values.account]);

  useDebounce(
    () => {
      handleGasEstimate();
    },
    500,
    [values.account, values.address, values.amount]
  );

  useEffect(() => {
    const asset = values.asset;
    const newAccount = getDefaultAccount(asset);
    const newInitialValues = getInitialFormikValues({
      s: txConfig,
      defaultAccount: newAccount,
      defaultAsset: asset,
      defaultNetwork: getDefaultNetwork(newAccount)
    });
    //@todo get assetType onChange
    resetForm({ values: { ...newInitialValues, asset } });
    if (asset && asset.networkId) {
      const network = getNetworkById(asset.networkId, networks);
      fetchGasPriceEstimates(network).then((data) => {
        setFieldValue('gasEstimates', data);
        setFieldValue('gasPriceSlider', data.fast);
      });
      setFieldValue('network', network || {});
      if (network) {
        setBaseAsset(getBaseAssetByNetwork({ network, assets: userAssets }) || ({} as Asset));
      }
    }
  }, [values.asset]);

  useEffect(() => {
    if (ptxState.protectTxShow) {
      if (goToInitialStepOrFetchReport && ptxState.receiverAddress !== values.address.value) {
        const { address, network } = values;
        goToInitialStepOrFetchReport(address.value, network);
      }
    }
  }, [values.address.value]);

  const toggleIsAutoGasSet = () => {
    // save value because setFieldValue method is async and values are not yet updated
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
      try {
        const gas = await getGasEstimate(values.network, finalTx);
        setFieldValue('gasLimitField', hexToNumber(gas).toString());
        setGasEstimationError(undefined);
      } catch (err) {
        setGasEstimationError(err.message);
      }
      setIsEstimatingGasLimit(false);
    } else {
      return;
    }
  };

  const setAmountFieldToAssetMax = () => {
    const account = getAccount(values.account);
    if (values.asset && account && baseAsset) {
      const accountBalance = getAccountBalance(account, values.asset).toString();
      const isERC20 = isERC20Asset(values.asset);
      const balance = fromTokenBase(new BN(accountBalance), values.asset.decimal);
      const gasPrice = values.advancedTransaction ? values.gasPriceField : values.gasPriceSlider;
      const amount = isERC20 // subtract gas cost from balance when sending a base asset
        ? balance
        : baseToConvertedUnit(
            new BN(convertedToBaseUnit(balance.toString(), DEFAULT_ASSET_DECIMAL))
              .sub(gasStringsToMaxGasBN(gasPrice, values.gasLimitField))
              .toString(),
            DEFAULT_ASSET_DECIMAL
          );
      setFieldValue('amount', amount);
    }
  };

  const handleNonceEstimate = async (account: IAccount) => {
    if (!values || !values.network || !account) {
      return;
    }
    setIsEstimatingNonce(true);
    const nonce: number = await getNonce(values.network, account.address);
    setFieldValue('nonceField', nonce.toString());
    setFetchedNonce(nonce);
    setIsEstimatingNonce(false);
  };

  const accountsWithAsset = getAccountsByAsset(validAccounts, values.asset);

  const isFormValid = checkFormValid(errors) && !gasEstimationError;
  const walletConfig = getWalletConfig(values.account.wallet);
  const supportsNonce = walletConfig.flags.supportsNonce;

  const { type, amount, fee } = validateTxFee(
    values.amount,
    getAssetRateInCurrency(baseAsset, Fiats.USD.ticker),
    getAssetRateInCurrency(baseAsset, getFiat(settings).ticker),
    isERC20Asset(values.asset),
    values.gasLimitField.toString(),
    values.advancedTransaction ? values.gasPriceField.toString() : values.gasPriceSlider.toString(),
    getAssetRateInCurrency(EthAsset, Fiats.USD.ticker)
  );

  return (
    <div className="SendAssetsForm">
      <QueryWarning />
      {isDemoMode && <DemoGatewayBanner />}
      {/* Asset */}
      <fieldset className="SendAssetsForm-fieldset">
        <label htmlFor="asset" className="input-group-header">
          {translate('X_ASSET')}
        </label>
        <AssetSelector
          selectedAsset={values.asset}
          assets={userAssets}
          onSelect={(option: StoreAsset) => {
            setFieldValue('asset', option || {}); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
          }}
        />
      </fieldset>
      {/* Sender Address */}
      <fieldset className="SendAssetsForm-fieldset">
        <label htmlFor="account" className="input-group-header">
          <div>
            {translate('X_SENDER')} <Tooltip tooltip={translateRaw('SENDER_TOOLTIP')} />
          </div>
        </label>

        <AccountSelector
          name="account"
          value={values.account}
          accounts={accountsWithAsset}
          onSelect={(account: StoreAccount) => {
            setFieldValue('account', account); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
          }}
          asset={values.asset}
        />
      </fieldset>
      <fieldset className="SendAssetsForm-fieldset">
        <label htmlFor="address" className="input-group-header">
          {translate('X_RECIPIENT')}
        </label>
        <ContactLookupField
          name="address"
          value={values.address}
          error={errors && touched.address && errors.address && (errors.address as ErrorObject)}
          network={values.network}
          isResolvingName={isResolvingName}
          setIsResolvingDomain={setIsResolvingDomain}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          setFieldError={setFieldError}
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
        <>
          <AmountInput
            name="amount"
            onChange={(e) => {
              setFieldValue('amount', e.target.value);
            }}
            asset={values.asset}
            value={values.amount}
            onBlur={() => {
              setFieldTouched('amount');
            }}
            placeholder={'0.00'}
          />
          {errors && errors.amount && touched && touched.amount && (
            <InlineMessage>{errors.amount}</InlineMessage>
          )}
        </>
      </fieldset>
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
              fiat: getFiat(settings).ticker,
              rate: (getAssetRate(baseAsset) || 0).toString(),
              symbol: getFiat(settings).symbol
            }}
          />
        </label>
        {!values.advancedTransaction && (
          <GasPriceSlider
            network={values.network}
            gasPrice={values.gasPriceSlider}
            gasEstimates={values.gasEstimates}
            onChange={(g) => setFieldValue('gasPriceSlider', g)}
          />
        )}
        {getTxFeeValidation({
          type,
          amount,
          fee,
          fiat: getFiat(settings)
        })}
      </fieldset>
      {/* Advanced Options */}
      <div className="SendAssetsForm-advancedOptions">
        <AdvancedOptionsButton
          basic={true}
          onClick={() => setFieldValue('advancedTransaction', !values.advancedTransaction)}
        >
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

                <GasLimitField
                  onChange={(option: string) => {
                    setFieldValue('gasLimitField', option);
                  }}
                  name="gasLimitField"
                  value={values.gasLimitField}
                  disabled={values.isAutoGasSet}
                  error={errors && errors.gasLimitField}
                />
              </div>
            </div>
            <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
              <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-price">
                <label htmlFor="gasPrice">
                  {translate('OFFLINE_STEP2_LABEL_3')}
                  <Tooltip tooltip={translate('GAS_PRICE_TOOLTIP')} />
                </label>
                <GasPriceField
                  onChange={(option: string) => {
                    setFieldValue('gasPriceField', option);
                  }}
                  name="gasPriceField"
                  value={values.gasPriceField}
                  error={errors && errors.gasPriceField}
                />
              </div>
            </div>
            <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
              <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-nonce">
                <label htmlFor="nonce">
                  <div>
                    {translateRaw('NONCE')} <Tooltip tooltip={translate('NONCE_TOOLTIP')} />
                    {/* @todo: Tooltip about disabled nonce? */}
                  </div>
                </label>
                <NonceField
                  onChange={(option: string) => {
                    setFieldValue('nonceField', option);
                  }}
                  name="nonceField"
                  value={values.nonceField}
                  error={
                    (errors && errors.nonceField) ||
                    (!supportsNonce
                      ? translate('DISABLED_NONCE', { $provider: walletConfig.name })
                      : undefined)
                  }
                  disabled={!supportsNonce}
                />
              </div>
            </div>

            {!isERC20Asset(values.asset) && (
              <fieldset className="SendAssetsForm-fieldset">
                <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
                  <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-data">
                    <label htmlFor="data">{translate('TRANS_DATA')}</label>
                    <DataField
                      onChange={(option: string) => {
                        setFieldValue('txDataField', option);
                      }}
                      errors={errors.txDataField}
                      name="txDataField"
                      value={values.txDataField}
                    />
                  </div>
                </div>
              </fieldset>
            )}
          </div>
        )}
      </div>
      {protectTxFeatureFlag && protectTxButton && protectTxButton()}
      <Button
        type="submit"
        onClick={() => {
          if (isFormValid) {
            onComplete(values);
          }
        }}
        disabled={
          isDemoMode || isEstimatingGasLimit || isResolvingName || isEstimatingNonce || !isFormValid
        }
        className="SendAssetsForm-next"
      >
        {translate('ACTION_6')}
      </Button>
      {gasEstimationError && (
        <InlineMessage
          value={translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', { $error: gasEstimationError })}
        />
      )}
      {protectTxFeatureFlag && (
        <ProtectTxShowError
          protectTxError={checkFormForProtectTxErrors(
            values,
            getAssetRate(values.asset),
            ptxState.isPTXFree
          )}
          shown={isFormValid}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & ISendFormProps;

export default connector(SendAssetsForm);
