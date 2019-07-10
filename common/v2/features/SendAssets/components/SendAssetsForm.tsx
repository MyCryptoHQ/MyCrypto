import { Button, Input } from '@mycrypto/ui';
import { ENSStatus } from 'components/AddressFieldFactory/AddressInputFactory';
import { WhenQueryExists } from 'components/renderCbs';
import { Field, FieldProps, Form, Formik } from 'formik';
import React, { useContext } from 'react';
import translate, { translateRaw } from 'translations';
import { fetchGasPriceEstimates, getNonce, getResolvedENSAddress } from 'v2';
import { InlineErrorMsg } from 'v2/components';
import { getAssetByUUID, getNetworkByName } from 'v2/libs';
import { AccountContext } from 'v2/providers';
import {
  Asset,
  AssetBalanceObject,
  ExtendedAccount,
  ExtendedAccount as IExtendedAccount
} from 'v2/services';
// import { processFormDataToTx } from 'v2/libs/transaction/process';
import { IAsset, TSymbol } from 'v2/types';
import * as Yup from 'yup';
import { FormikFormState, ISendState, ITxFields, SendState } from '../types';
import TransactionFeeDisplay from './displays/TransactionFeeDisplay';
import TransactionValueDisplay from './displays/TransactionValuesDisplay';
import {
  AccountDropdown,
  AssetDropdown,
  DataField,
  EthAddressField,
  GasLimitField,
  GasPriceField,
  GasPriceSlider,
  NonceField
} from './fields';
import './SendAssetsForm.scss';
import {
  validateDataField,
  validateGasLimitField,
  validateGasPriceField,
  validateNonceField
} from './validators/validators';

interface Props {
  stateValues: ISendState;
  transactionFields: SendState;
  onNext(): void;
  // onSubmit(transactionFields: ISendState): void;
  updateSendState(state: FormikFormState): void;
}

const initialState: FormikFormState = {
  transactionData: {
    to: '',
    gasLimit: '',
    gasPrice: '',
    nonce: '',
    data: '',
    value: '',
    chainId: undefined
  },
  sharedConfig: {
    senderAddress: '',
    senderAddressLabel: '',
    senderWalletBalanceBase: '',
    senderWalletBalanceToken: '',
    senderAccountType: '',
    senderNetwork: undefined,
    asset: undefined,
    assetNetwork: undefined,
    assetSymbol: '',
    assetType: undefined,
    dPath: '',
    recipientAddressLabel: '',
    recipientResolvedNSAddress: ''
  },
  formikState: {
    gasPriceSlider: '20',
    gasPriceField: '20',
    gasLimitField: '21000',
    gasLimitEstimated: '21000',
    nonceEstimated: '0',
    nonceField: '0',
    isGasLimitManual: false,
    isResolvingNSName: false,
    isAdvancedTransaction: false,
    gasEstimates: {
      fastest: 20,
      fast: 18,
      standard: 12,
      isDefault: false,
      safeLow: 4,
      time: Date.now(),
      chainId: 1
    }
  },
  transaction: {
    serialized: '',
    signed: '',
    txHash: ''
  }
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
  transactionData: Yup.object().shape({
    value: Yup.number()
      .required('Required')
      .min(0.001, 'Minimun required')
      .max(1001, 'Above the balance')
  })
});

export default function SendAssetsForm({
  // transactionFields,
  // onNext,
  updateSendState
}: Props) {
  const { accounts } = useContext(AccountContext);
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
        initialValues={initialState}
        validationSchema={SendAssetsSchema}
        onSubmit={(fields: FormikFormState) => {
          updateSendState(fields);
          // onNext();
        }}
        render={({ errors, touched, setFieldValue, values, handleChange, submitForm }) => {
          const toggleAdvancedOptions = () => {
            setFieldValue(
              'formikState.isAdvancedTransaction',
              !values.formikState.isAdvancedTransaction
            );
          };

          const handleGasEstimate = async () => {
            if (!values || !values.sharedConfig.senderNetwork) {
              return;
            }
            // const finalTx = processFormDataToTx(values.transactionData);
            // if (!finalTx) {
            //   return;
            // }

            // if (!values.formikState.isAdvancedTransaction) {
            //   const gas = await getGasEstimate(values.sharedConfig.senderNetwork, finalTx);
            //   setFieldValue('formikState.gasLimitEstimated', gas);
            // } else {
            //   return;
            // }
          };

          const handleENSResolve = async (name: string) => {
            if (!values || !values.sharedConfig.senderNetwork) {
              return;
            }
            setFieldValue('formikState.isResolvingNSName', true);
            const resolvedAddress: string | null = await getResolvedENSAddress(
              values.sharedConfig.senderNetwork,
              name
            );
            setFieldValue('formikState.isResolvingNSName', false);
            resolvedAddress === null
              ? setFieldValue('formikState.resolvedNSAddress', '0x0')
              : setFieldValue('formikState.resolvedNSAddress', resolvedAddress);
          };

          //move this to parent
          const handleFieldReset = () => {
            setFieldValue('account', undefined);
            setFieldValue('transactionData.to', '');
            setFieldValue('transactionData.value', '');
          };

          const setAmountFieldToAssetMax = () =>
            // @TODO get asset balance and subtract gas cost
            setFieldValue('transactionData.value', '1000');

          const handleNonceEstimate = async (account: ExtendedAccount) => {
            if (!values || !values.sharedConfig.senderNetwork) {
              return;
            }
            const nonce: number = await getNonce(values.sharedConfig.senderNetwork, account);
            setFieldValue('formikState.nonceEstimated', nonce.toString());
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
                        form.setFieldValue(field.name, option); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                        form.setFieldValue('sharedConfig.asset', option.name);
                        form.setFieldValue('sharedConfig.assetSymbol', option.symbol);
                        form.setFieldValue('sharedConfig.assetNetwork', option.network);
                        //TODO get assetType onChange
                        handleFieldReset();
                        if (option.network) {
                          fetchGasPriceEstimates(option.network).then(data => {
                            form.setFieldValue('formikState.gasEstimates', data);
                            form.setFieldValue('formikState.gasPriceSlider', data.fast);
                          });
                          form.setFieldValue(
                            'sharedConfig.assetNetwork',
                            getNetworkByName(option.network)
                          );
                          handleGasEstimate();
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
                      values={values}
                      name={field.name}
                      value={field.value}
                      accounts={accounts}
                      onSelect={(option: IExtendedAccount) => {
                        //TODO: map account values to correct keys in sharedConfig
                        form.setFieldValue(field.name, option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                        handleNonceEstimate(option);
                        handleGasEstimate();
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
                  handleENSResolve={handleENSResolve}
                  error={errors.transactionData && errors.transactionData.to}
                  touched={touched.transactionData && touched.transactionData.to}
                  values={values}
                  fieldName="transactionData.to"
                  placeholder="Enter an Address or Contact"
                />
                <ENSStatus
                  ensAddress={values.transactionData.to}
                  isLoading={values.formikState.isResolvingNSName}
                  rawAddress={values.sharedConfig.recipientResolvedNSAddress}
                  chainId={
                    values.sharedConfig.senderNetwork
                      ? values.sharedConfig.senderNetwork.chainId
                      : 1
                  }
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
                  name="transactionData.value"
                  render={({ field }: FieldProps) => (
                    <Input value={field.value} placeholder={'0.00'} {...field} />
                  )}
                />
                {errors.transactionData &&
                errors.transactionData.value &&
                touched.transactionData &&
                touched.transactionData.value ? (
                  <InlineErrorMsg className="SendAssetsForm-errors">
                    {errors.transactionData.value}
                  </InlineErrorMsg>
                ) : null}
              </fieldset>
              {/* You'll Send */}
              <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
                <label>You'll Send</label>
                <TransactionValueDisplay
                  amount={values.transactionData.value || '0.00'}
                  ticker={
                    values.sharedConfig.asset
                      ? values.sharedConfig.asset.symbol
                      : ('ETH' as TSymbol)
                  }
                  fiatAsset={{ ticker: 'USD' as TSymbol, exchangeRate: '250' }}
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
                {!values.formikState.isAdvancedTransaction && (
                  <GasPriceSlider
                    transactionFieldValues={values}
                    handleChange={(e: string) => {
                      handleGasEstimate();
                      handleChange(e);
                    }}
                    gasPrice={values.formikState.gasPriceSlider}
                    gasEstimates={values.formikState.gasEstimates}
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
                  {values.formikState.isAdvancedTransaction ? 'Hide' : 'Show'} Advanced Options
                </Button>
                {values.formikState.isAdvancedTransaction && (
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
                          name="formikState.gasPriceField"
                          validate={validateGasPriceField}
                          render={({ field, form }: FieldProps<ITxFields>) => (
                            <GasPriceField
                              onChange={(option: string) => {
                                form.setFieldValue('formikState.gasPriceField', option);
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
                          name="formikState.gasLimitField"
                          validate={validateGasLimitField}
                          render={({ field, form }: FieldProps<ITxFields>) => (
                            <GasLimitField
                              onChange={(option: string) => {
                                form.setFieldValue('formikState.gasLimitField', option);
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
                          name="formikState.nonceField"
                          validate={validateNonceField}
                          render={({ field, form }: FieldProps<ITxFields>) => (
                            <NonceField
                              onChange={(option: string) => {
                                form.setFieldValue('formikState.nonceField', option);
                              }}
                              name={field.name}
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="SendAssetsForm-errors">
                      {errors.formikState &&
                        errors.formikState.gasPriceField && (
                          <InlineErrorMsg>{errors.formikState.gasPriceField}</InlineErrorMsg>
                        )}
                      {errors.formikState &&
                        errors.formikState.gasLimitField && (
                          <InlineErrorMsg>{errors.formikState.gasLimitField}</InlineErrorMsg>
                        )}
                      {errors.formikState &&
                        errors.formikState.nonceField && (
                          <InlineErrorMsg>{errors.formikState.nonceField}</InlineErrorMsg>
                        )}
                    </div>
                    <fieldset className="SendAssetsForm-fieldset">
                      <label htmlFor="data">Data{/* TRANSLATE THIS */}</label>
                      <Field
                        name="transactionData.data"
                        validate={validateDataField}
                        render={({ field, form }: FieldProps<ITxFields>) => (
                          <DataField
                            onChange={(option: string) => {
                              form.setFieldValue('transactionData.data', option);
                            }}
                            errors={errors.transactionData && errors.transactionData.data}
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

              <Button type="submit" onClick={submitForm} className="SendAssetsForm-next">
                Next{/* TRANSLATE THIS */}
              </Button>
            </Form>
          );
        }}
      />
    </div>
  );
}
