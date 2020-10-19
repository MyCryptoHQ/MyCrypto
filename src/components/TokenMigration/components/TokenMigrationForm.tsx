import React, { useContext, useEffect } from 'react';

import { bigNumberify } from 'ethers/utils';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { number, object } from 'yup';

import {
  AccountSelector,
  AmountInput,
  Box,
  Button,
  InlineMessage,
  Label,
  Tooltip
} from '@components';
import { ETHUUID } from '@config';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';
import { fetchGasPriceEstimates } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { StoreContext, useAssets, useNetworks } from '@services/Store';
import { isEthereumAccount } from '@services/Store/Account/helpers';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  Asset,
  ExtendedAsset,
  IAccount,
  ISimpleTxFormFull,
  ITokenMigrationConfig,
  Network,
  StoreAccount
} from '@types';
import { isFormValid as checkFormValid, noOp, weiToFloat } from '@utils';

export interface TokenMigrationProps extends ISimpleTxFormFull {
  isSubmitting: boolean;
  tokenMigrationConfig: ITokenMigrationConfig;
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  network: Network;
  relevantAccounts: StoreAccount[];
  storeDefaultAccount: StoreAccount;
  defaultAsset: ExtendedAsset;
  isSubmitting: boolean;
  tokenMigrationConfig: ITokenMigrationConfig;
  onComplete(fields: any): void;
}

const FormFieldSubmitButton = styled(Button)`
  width: 100%;
  display: inline-block;
  &:disabled {
    background-color: rgba(0, 122, 153, 0.3);
  }
`;

const TokenMigrationForm = ({
  tokenMigrationConfig,
  isSubmitting,
  onComplete
}: TokenMigrationProps) => {
  const { accounts, defaultAccount: defaultStoreAccount } = useContext(StoreContext);
  const { networks } = useNetworks();
  const { getAssetByUUID } = useAssets();
  const network = networks.find((n) => n.baseAsset === ETHUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);
  const defaultAsset = (getAssetByUUID(tokenMigrationConfig.fromAssetUuid) || {}) as Asset;
  const defaultAccount = accounts.find((a) =>
    a.assets.find(({ uuid }) => uuid === tokenMigrationConfig.fromAssetUuid)
  );
  return (
    <TokenMigrationFormUI
      isSubmitting={isSubmitting}
      network={network}
      relevantAccounts={relevantAccounts}
      storeDefaultAccount={defaultAccount || defaultStoreAccount}
      defaultAsset={defaultAsset}
      tokenMigrationConfig={tokenMigrationConfig}
      onComplete={onComplete}
    />
  );
};

export const TokenMigrationFormUI = ({
  isSubmitting,
  network,
  relevantAccounts,
  storeDefaultAccount,
  defaultAsset,
  tokenMigrationConfig,
  onComplete
}: UIProps) => {
  const getInitialFormikValues = (storeDefaultAcc: StoreAccount): ISimpleTxFormFull => ({
    account: storeDefaultAcc,
    amount: '0',
    asset: defaultAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network
  });

  const convertedAsset = {
    name: defaultAsset.name,
    ticker: defaultAsset.ticker,
    uuid: defaultAsset.uuid
  };
  const filteredAccounts = getAccountsWithAssetBalance(relevantAccounts, convertedAsset, '0.001');
  const TokenMigrationFormSchema = object().shape({
    amount: number()
      .min(0, translateRaw('ERROR_0'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_0'))
  });

  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormik({
    initialValues: getInitialFormikValues(storeDefaultAccount),
    enableReinitialize: true,
    validationSchema: TokenMigrationFormSchema,
    onSubmit: noOp
  });
  const { amount, asset, account: selectedAccount } = values;

  useEffect(() => {
    if (!values.account) return;
    const accountAssetAmt = values.account.assets.find(
      (a) => a.uuid === tokenMigrationConfig.fromAssetUuid
    );
    if (!accountAssetAmt) {
      return;
    }
    setFieldValue(
      'amount',
      weiToFloat(bigNumberify(accountAssetAmt.balance), asset.decimal).toString()
    ); // this would be better as a reducer imo.
    setFieldValue('account', values.account); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object

    handleNonceEstimate(values.account);
  }, [values.account]);

  const handleNonceEstimate = async (account: IAccount) => {
    const nonce: number = await getNonce(values.network, account.address);
    setFieldValue('nonce', nonce);
  };

  useEffect(() => {
    if (
      amount &&
      asset &&
      selectedAccount &&
      !getAccountsWithAssetBalance(filteredAccounts, convertedAsset, amount).find(
        (a) => a.uuid === selectedAccount.uuid
      )
    ) {
      setFieldValue('account', undefined);
    }
  }, [amount, asset]);

  const isFormValid = checkFormValid(errors);

  return (
    <>
      <Box mb={SPACING.LG}>
        <Label htmlFor="account">{translate('SELECT_YOUR_ACCOUNT')}</Label>
        <AccountSelector
          name={'account'}
          value={values.account}
          accounts={filteredAccounts}
          asset={values.asset}
          onSelect={(option: IAccount) => {
            setFieldValue('account', option);
          }}
        />
        {filteredAccounts.length === 0 && (
          <InlineMessage>{translateRaw('NO_RELEVANT_ACCOUNTS')}</InlineMessage>
        )}
      </Box>
      <Box mb={SPACING.LG} display="flex" flexDirection="column">
        <Label htmlFor="amount">{translate('SEND_ASSETS_AMOUNT_LABEL')}</Label>
        <Tooltip tooltip={tokenMigrationConfig.formAmountTooltip}>
          <AmountInput
            disabled={true}
            asset={values.asset}
            value={values.amount || '0'}
            onChange={noOp}
            onBlur={() => {
              setFieldTouched('amount');
            }}
            placeholder={'0.00'}
          />
          {errors && errors.amount && touched && touched.amount ? (
            <InlineMessage className="SendAssetsForm-errors">{errors.amount}</InlineMessage>
          ) : null}
        </Tooltip>
      </Box>
      <FormFieldSubmitButton
        type="submit"
        loading={isSubmitting}
        onClick={() => {
          if (isFormValid) {
            fetchGasPriceEstimates(values.network).then(({ fast }) => {
              onComplete({ ...values, gasPrice: fast.toString() });
            });
          }
        }}
        disabled={!isFormValid}
      >
        {tokenMigrationConfig.formActionBtn}
      </FormFieldSubmitButton>
    </>
  );
};

export default TokenMigrationForm;
