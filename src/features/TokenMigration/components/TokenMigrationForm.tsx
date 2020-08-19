import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { bigNumberify } from 'ethers/utils';

import translate, { translateRaw } from '@translations';
import { SPACING } from '@theme';
import { IAccount, Network, StoreAccount, Asset, ISimpleTxFormFull, ExtendedAsset } from '@types';
import { AccountSelector, InlineMessage, AmountInput, Button, Tooltip } from '@components';
import { isEthereumAccount } from '@services/Store/Account/helpers';
import { StoreContext, AssetContext, NetworkContext } from '@services/Store';
import { fetchGasPriceEstimates } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { ETHUUID, noOp, weiToFloat, isFormValid as checkFormValid } from '@utils';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';

import { tokenMigrationConfig } from '../config';

export interface TokenMigrationProps extends ISimpleTxFormFull {
  isSubmitting: boolean;
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  network: Network;
  relevantAccounts: StoreAccount[];
  storeDefaultAccount: StoreAccount;
  defaultAsset: ExtendedAsset;
  isSubmitting: boolean;
  onComplete(fields: any): void;
}

const FormFieldItem = styled.fieldset`
  margin-bottom: ${SPACING.LG};
`;

const FormFieldLabel = styled.label`
  display: flex;
  font-size: 1rem;
  margin-bottom: ${SPACING.SM};
  font-weight: 400;
  align-items: center;
  flex-wrap: wrap;
`;

const FormFieldSubmitButton = styled(Button)`
  width: 100%;
  display: inline-block;
  &:disabled {
    background-color: rgba(0, 122, 153, 0.3);
  }
`;

const TokenMigrationForm = ({ isSubmitting, onComplete }: TokenMigrationProps) => {
  const { accounts, defaultAccount: defaultStoreAccount } = useContext(StoreContext);
  const { networks } = useContext(NetworkContext);
  const { getAssetByUUID } = useContext(AssetContext);
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

  const TokenMigrationFormSchema = Yup.object().shape({
    amount: Yup.number()
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
    <div>
      <FormFieldItem>
        <FormFieldLabel htmlFor="account">{translate('SELECT_YOUR_ACCOUNT')}</FormFieldLabel>
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
      </FormFieldItem>
      <FormFieldItem>
        <FormFieldLabel htmlFor="amount">
          <div>{translate('SEND_ASSETS_AMOUNT_LABEL')}</div>
        </FormFieldLabel>
        <>
          <Tooltip tooltip={translateRaw('REP_TOKEN_MIGRATION_AMOUNT_DISABLED_TOOLTIP')}>
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
        </>
      </FormFieldItem>
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
        {translateRaw('REP_TOKEN_MIGRATION')}
      </FormFieldSubmitButton>
    </div>
  );
};

export default TokenMigrationForm;
