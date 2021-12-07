import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import { Button as UIBtn } from '@mycrypto/ui';
import isEmpty from 'lodash/isEmpty';
import mergeDeepWith from 'ramda/src/mergeDeepWith';
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
  LinkApp,
  Tooltip,
  TransactionFeeEIP1559,
  WhenQueryExists
} from '@components';
import TransactionFeeDisplay from '@components/TransactionFlow/displays/TransactionFeeDisplay';
import {
  DEFAULT_ASSET_DECIMAL,
  DEFAULT_NETWORK,
  ETHUUID,
  getKBHelpArticle,
  getWalletConfig,
  KB_HELP_ARTICLE,
  ROUTE_PATHS
} from '@config';
import { getFiat } from '@config/fiats';
import { checkFormForProtectTxErrors } from '@features/ProtectTransaction';
import { ProtectTxShowError } from '@features/ProtectTransaction/components/ProtectTxShowError';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { isEIP1559Supported } from '@helpers';
import { useGasForm } from '@hooks';
import { getNonce, useRates } from '@services';
import {
  isBurnAddress,
  isValidETHAddress,
  isValidPositiveNumber
} from '@services/EthService/validators';
import {
  getAccountBalance,
  getAccountsByAsset,
  getBaseAssetByNetwork,
  getNetworkById,
  useAssets,
  useSettings
} from '@services/Store';
import {
  getIsDemoMode,
  getStoreAccounts,
  getUserAssets,
  selectNetworks,
  useSelector
} from '@store';
import translate, { Trans, translateRaw } from '@translations';
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
  getDecimals,
  isSameAddress,
  isVoid,
  sortByLabel,
  toTokenBase
} from '@utils';
import { useDebounce } from '@vendor';

import { isERC20Asset, processFormForEstimateGas } from '../helpers';
import { DataField, GasLimitField, GasPriceField, GasPriceSlider, NonceField } from './fields';
import './SendAssetsForm.scss';
import { TxFeeValidation } from './TxFeeValidation';
import {
  canAffordTX,
  validateAmountField,
  validateDataField,
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
  gasPriceSlider: '20',
  gasPriceField: '20',
  maxFeePerGasField: '20',
  maxPriorityFeePerGasField: '1',
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
  defaultNetwork,
  networks
}: {
  s: ITxConfig;
  defaultAccount: StoreAccount | undefined;
  defaultAsset: Asset | undefined;
  defaultNetwork: Network | undefined;
  networks: Network[];
}): IFormikFields => {
  const gasPriceInGwei =
    s.rawTransaction &&
    'gasPrice' in s.rawTransaction &&
    bigNumGasPriceToViewableGwei(bigify(s.rawTransaction.gasPrice));
  const state: Partial<IFormikFields> = {
    amount: s.amount,
    account: !isVoid(s.senderAccount) ? s.senderAccount : defaultAccount,
    network: !isVoid(s.networkId) ? networks.find((n) => n.id === s.networkId) : defaultNetwork,
    asset: !isVoid(s.asset) ? s.asset : defaultAsset,
    nonceField: s.rawTransaction?.nonce,
    txDataField: s.rawTransaction?.data,
    address: { value: s.receiverAddress!, display: s.receiverAddress! },
    gasLimitField: s.rawTransaction?.gasLimit && bigify(s.rawTransaction?.gasLimit).toString(),
    gasPriceSlider: gasPriceInGwei as string,
    gasPriceField: gasPriceInGwei as string,
    maxFeePerGasField: (s.rawTransaction &&
      'maxFeePerGas' in s.rawTransaction &&
      bigNumGasPriceToViewableGwei(bigify(s.rawTransaction.maxFeePerGas))) as string,
    maxPriorityFeePerGasField: (s.rawTransaction &&
      'maxPriorityFeePerGas' in s.rawTransaction &&
      bigNumGasPriceToViewableGwei(bigify(s.rawTransaction.maxPriorityFeePerGas))) as string
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

export const SendAssetsForm = ({ txConfig, onComplete, protectTxButton }: ISendFormProps) => {
  const accounts = useSelector(getStoreAccounts);
  const networks = useSelector(selectNetworks);
  const { getAssetRate } = useRates();
  const { getAssetByUUID, assets } = useAssets();
  const { settings } = useSettings();
  const [isEstimatingNonce, setIsEstimatingNonce] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [isResolvingName, setIsResolvingDomain] = useState(false); // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  const [fetchedNonce, setFetchedNonce] = useState(0);
  const [isSendMax, toggleIsSendMax] = useState(false);

  const userAssets = useSelector(getUserAssets);
  const isDemoMode = useSelector(getIsDemoMode);

  const EthAsset = getAssetByUUID(ETHUUID as TUuid)!;

  const validAccounts = accounts.filter((account) => account.wallet !== WalletId.VIEW_ONLY);
  const userAccountEthAsset = userAssets.find((a) => a.uuid === ETHUUID);
  const defaultAsset = (() => {
    if (userAccountEthAsset) {
      return userAccountEthAsset;
    } else if (userAssets.length > 0) {
      return userAssets[0];
    }
    return EthAsset;
  })();

  const getDefaultAccount = (asset?: Asset) => {
    if (asset) {
      const accountsWithDefaultAsset = validAccounts.filter((account) =>
        account.assets.some((a) => a.uuid === asset.uuid)
      );
      if (accountsWithDefaultAsset.length > 0) {
        return sortByLabel(accountsWithDefaultAsset)[0];
      }
    }
    return undefined;
  };
  const getDefaultNetwork = (account?: StoreAccount) =>
    networks.find((n) => n.id === (account !== undefined ? account.networkId : DEFAULT_NETWORK));

  const defaultAccount = getDefaultAccount(defaultAsset);
  const defaultNetwork = getDefaultNetwork(defaultAccount);

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
              const decimals = getDecimals(value);
              if (decimals > asset.decimal) {
                return this.createError({
                  message: translateRaw('TOO_MANY_DECIMALS', {
                    $decimals: asset.decimal.toString()
                  })
                });
              }
              const amount = BigNumber.from(toTokenBase(value, asset.decimal).toString());
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
      .test('valid', translateRaw('TO_FIELD_ERROR'), function (value) {
        return value && value.value && isValidETHAddress(value.value);
      })
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
        defaultNetwork,
        networks
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
    touched,
    legacyGasEstimates,
    isEstimatingGasPrice,
    isEstimatingGasLimit,
    gasEstimationError,
    baseFee,
    handleGasPriceChange,
    handleGasLimitChange,
    handleMaxFeeChange,
    handleMaxPriorityFeeChange,
    handleGasPriceEstimation: performGasPriceEstimation,
    handleGasLimitEstimation
  } = useGasForm({
    initialValues,
    validationSchema: SendAssetsSchema,
    onSubmit: (fields) => {
      onComplete(fields);
    }
  });

  const network = values.network;
  const baseAsset = !isVoid(network)
    ? getBaseAssetByNetwork({ network, assets })!
    : getBaseAssetByNetwork({ network: defaultNetwork!, assets })!;

  const isEIP1559 = isEIP1559Supported(network, values.account);

  const gasPrice = isEIP1559
    ? values.maxFeePerGasField.toString()
    : values.advancedTransaction
    ? values.gasPriceField.toString()
    : values.gasPriceSlider.toString();

  useEffect(() => {
    if (updateFormValues && ptxState.protectTxShow) {
      updateFormValues(values);
    }
  }, [values, ptxState?.protectTxShow]);

  useEffect(() => {
    handleNonceEstimate(values.account);
  }, [values.account]);

  useEffect(() => {
    handleGasPriceEstimation();
  }, [values.account, values.network]);

  useDebounce(
    () => {
      handleGasEstimate();
    },
    500,
    [values.account, values.address, values.amount, values.txDataField]
  );

  const handleGasPriceEstimation = (network = values.network) =>
    performGasPriceEstimation(network, values.account);

  useEffect(() => {
    const asset = values.asset;
    const newAccount = getDefaultAccount(asset);
    const newInitialValues = getInitialFormikValues({
      s: txConfig,
      defaultAccount: newAccount,
      defaultAsset: asset,
      defaultNetwork: getDefaultNetwork(newAccount),
      networks
    });
    //@todo get assetType onChange
    resetForm({ values: { ...newInitialValues, asset } });
    if (asset && asset.networkId) {
      const network = getNetworkById(asset.networkId, networks);
      handleGasPriceEstimation(network);
      setFieldValue('network', network || {});
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

  const handleGasEstimate = (forceEstimate: boolean = false) => {
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
      const finalTx = processFormForEstimateGas(values);
      handleGasLimitEstimation(values.network, finalTx);
    }
  };

  const setAmountFieldToAssetMax = () => {
    if (values.asset && values.account && baseAsset) {
      const accountBalance = getAccountBalance(values.account, values.asset);
      const isERC20 = isERC20Asset(values.asset);
      const balance = fromTokenBase(bigify(accountBalance), values.asset.decimal);
      const amount = isERC20 // subtract gas cost from balance when sending a base asset
        ? balance
        : baseToConvertedUnit(
            bigify(convertedToBaseUnit(balance.toString(), DEFAULT_ASSET_DECIMAL))
              .minus(gasStringsToMaxGasBN(gasPrice, values.gasLimitField))
              .toString(),
            DEFAULT_ASSET_DECIMAL
          );
      setFieldValue('amount', amount);
    }
  };

  const handleNonceEstimate = async (account: IAccount) => {
    if (!values || !values.network || isVoid(account)) {
      return;
    }
    setIsEstimatingNonce(true);
    try {
      const nonce: number = await getNonce(values.network, account.address);
      setFieldValue('nonceField', nonce.toString());
      setFetchedNonce(nonce);
    } catch (err) {
      console.error(err);
    }
    setIsEstimatingNonce(false);
  };

  const handleAssetChange = (asset: StoreAsset) => setFieldValue('asset', asset || {});
  const handleAccountChange = (account: StoreAccount) => setFieldValue('account', account);
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFieldValue('amount', e.target.value);
  const handleGasSliderChange = (value: number) => setFieldValue('gasPriceSlider', value);
  const handleNonceChange = (value: string) => setFieldValue('nonceField', value);
  const handleDataChange = (value: string) => setFieldValue('txDataField', value);
  const handleAdvancedTransactionToggle = () =>
    setFieldValue('advancedTransaction', !values.advancedTransaction);

  const accountsWithAsset = getAccountsByAsset(validAccounts, values.asset);

  const userCanAffordTX = canAffordTX(baseAsset, values, gasPrice);
  const formHasErrors = !checkFormValid(errors);

  const isFormValid = !formHasErrors && !gasEstimationError && userCanAffordTX;
  const walletConfig = getWalletConfig(values.account.wallet || WalletId.WEB3);
  const supportsNonce = walletConfig.flags.supportsNonce;

  const fiat = getFiat(settings);

  const baseAssetRate = (getAssetRate(baseAsset) ?? 0).toString();

  useEffect(() => {
    if (isSendMax) {
      setAmountFieldToAssetMax();
    }
  }, [
    values.gasPriceField,
    values.gasPriceSlider,
    values.asset,
    values.account,
    values.advancedTransaction,
    values.gasLimitField,
    values.maxFeePerGasField,
    isSendMax
  ]);

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
          searchable={true}
          showAssetName={true}
          onSelect={handleAssetChange}
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
          onSelect={handleAccountChange}
          asset={values.asset}
        />
        {accountsWithAsset.length === 0 && (
          <InlineMessage type={InlineMessageType.WARNING}>
            <Trans
              id="NO_NON_VIEW_ONLY_ACCOUNTS"
              variables={{
                $link_add_account: () => (
                  <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT.path}>
                    {translateRaw('ADD_AN_ACCOUNT')}
                  </LinkApp>
                ),
                $link_support: () => (
                  <LinkApp
                    href={getKBHelpArticle(KB_HELP_ARTICLE.HOW_DOES_VIEW_ADDRESS_WORK)}
                    isExternal={true}
                  >
                    {translateRaw('VIEW_ONLY_ADDRESSES')}
                  </LinkApp>
                )
              }}
            />
          </InlineMessage>
        )}
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
          <NoMarginCheckbox
            onChange={() => toggleIsSendMax(!isSendMax)}
            checked={isSendMax}
            name="isSendMax"
            label={translateRaw('SEND_ASSETS_AMOUNT_LABEL_ACTION')}
          />
        </label>
        <>
          <AmountInput
            name="amount"
            onChange={handleAmountChange}
            disabled={isSendMax}
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
        {!isEIP1559 && (
          <label
            htmlFor="transactionFee"
            className="SendAssetsForm-fieldset-transactionFee input-group-header"
          >
            <div>{translate('CONFIRM_TX_FEE')}</div>
            <TransactionFeeDisplay
              baseAsset={baseAsset}
              gasLimitToUse={values.gasLimitField}
              gasPriceToUse={
                values.advancedTransaction ? values.gasPriceField : values.gasPriceSlider
              }
              fiatAsset={{
                fiat: fiat.ticker,
                rate: baseAssetRate,
                symbol: fiat.symbol
              }}
            />
          </label>
        )}
        {isEIP1559 && (
          <TransactionFeeEIP1559
            baseAsset={baseAsset}
            baseFee={baseFee}
            baseAssetRate={baseAssetRate}
            fiat={fiat}
            gasLimit={values.gasLimitField}
            maxFeePerGas={values.maxFeePerGasField}
            maxPriorityFeePerGas={values.maxPriorityFeePerGasField}
            setGasLimit={handleGasLimitChange}
            setMaxFeePerGas={handleMaxFeeChange}
            setMaxPriorityFeePerGas={handleMaxPriorityFeeChange}
            gasLimitError={errors && errors.gasLimitField}
            maxFeePerGasError={errors && errors.maxFeePerGasField}
            maxPriorityFeePerGasError={errors && errors.maxPriorityFeePerGasField}
            handleGasPriceEstimation={handleGasPriceEstimation}
            handleGasLimitEstimation={handleGasEstimate}
            isEstimatingGasLimit={isEstimatingGasLimit}
            isEstimatingGasPrice={isEstimatingGasPrice}
          />
        )}
        {!values.advancedTransaction && !isEIP1559 && (
          <GasPriceSlider
            network={values.network}
            gasPrice={values.gasPriceSlider}
            gasEstimates={legacyGasEstimates}
            onChange={handleGasSliderChange}
          />
        )}
        <TxFeeValidation
          amount={values.amount}
          baseAsset={baseAsset}
          asset={values.asset}
          gasLimit={values.gasLimitField}
          fiat={fiat}
          gasPrice={gasPrice}
          ethAsset={EthAsset}
          baseFee={baseFee}
        />
      </fieldset>
      {/* Advanced Options */}
      <div className="SendAssetsForm-advancedOptions">
        <AdvancedOptionsButton basic={true} onClick={handleAdvancedTransactionToggle}>
          {values.advancedTransaction ? translateRaw('HIDE') : translateRaw('SHOW')}{' '}
          {translate('ADVANCED_OPTIONS_LABEL')}
        </AdvancedOptionsButton>
        {values.advancedTransaction && (
          <div className="SendAssetsForm-advancedOptions-content">
            {!isEIP1559 && (
              <>
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
                      onChange={handleGasLimitChange}
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
                      {translate('GAS_PRICE')}
                      <Tooltip tooltip={translate('GAS_PRICE_TOOLTIP')} />
                    </label>
                    <GasPriceField
                      onChange={handleGasPriceChange}
                      name="gasPriceField"
                      value={values.gasPriceField}
                      error={errors && errors.gasPriceField}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData">
              <div className="SendAssetsForm-advancedOptions-content-priceLimitNonceData-nonce">
                <label htmlFor="nonce">
                  <div>
                    {translateRaw('NONCE')} <Tooltip tooltip={translate('NONCE_TOOLTIP')} />
                    {/* @todo: Tooltip about disabled nonce? */}
                  </div>
                </label>
                <NonceField
                  onChange={handleNonceChange}
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
                      onChange={handleDataChange}
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
      {!formHasErrors && !gasEstimationError && !userCanAffordTX && (
        <InlineMessage value={translate('NOT_ENOUGH_GAS', { $baseAsset: baseAsset.ticker })} />
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
