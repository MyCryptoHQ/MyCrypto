import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import isEmpty from 'lodash/isEmpty';
import * as Yup from 'yup';
import { bigNumberify } from 'ethers/utils';

import translate, { translateRaw } from '@translations';
import { SPACING } from '@theme';
import { IAccount, Network, StoreAccount, Asset } from '@types';
import { AccountSelector, InlineMessage, AmountInput, Button, Tooltip } from '@components';
import { isEthereumAccount } from '@services/Store/Account/helpers';
import { StoreContext, AssetContext, NetworkContext } from '@services/Store';
import { fetchGasPriceEstimates } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { ETHUUID, noOp, weiToFloat } from '@utils';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';

import { ISimpleTxFormFull } from '../types';
import { tokenMigrationConfig } from '../config';

interface Props extends ISimpleTxFormFull {
  isSubmitting: boolean;
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  network: Network;
  relevantAccounts: StoreAccount[];
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

const TokenMigrationForm = ({ isSubmitting, onComplete }: Props) => {
  const { accounts } = useContext(StoreContext);
  const { networks } = useContext(NetworkContext);
  const network = networks.find((n) => n.baseAsset === ETHUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <TokenMigrationFormUI
      isSubmitting={isSubmitting}
      network={network}
      relevantAccounts={relevantAccounts}
      onComplete={onComplete}
    />
  );
};

export const TokenMigrationFormUI = ({
  isSubmitting,
  network,
  relevantAccounts,
  onComplete
}: UIProps) => {
  const { getAssetByUUID } = useContext(AssetContext);
  const defaultAsset = (getAssetByUUID(tokenMigrationConfig.fromAssetUuid) || {}) as Asset;
  const initialFormikValues: ISimpleTxFormFull = {
    account: {} as StoreAccount,
    amount: '0',
    asset: defaultAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network
  };

  const TokenMigrationFormSchema = Yup.object().shape({
    amount: Yup.number()
      .min(0, translateRaw('ERROR_0'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_0'))
  });
  const formik = useFormik({
    initialValues: initialFormikValues,
    enableReinitialize: true,
    validationSchema: TokenMigrationFormSchema,
    onSubmit: noOp
  });

  const handleAccountChange = (account: IAccount) => {
    const accountAssetAmt = account.assets.find(
      (a) => a.uuid === tokenMigrationConfig.fromAssetUuid
    );
    if (!accountAssetAmt) {
      return;
    }
    formik.setFieldValue(
      'amount',
      weiToFloat(bigNumberify(accountAssetAmt.balance), asset.decimal).toString()
    ); // this would be better as a reducer imo.
    formik.setFieldValue('account', account); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object

    handleNonceEstimate(account);
  };
  const handleNonceEstimate = async (account: IAccount) => {
    const nonce: number = await getNonce(formik.values.network, account.address);
    formik.setFieldValue('nonce', nonce);
  };
  const isValid =
    Object.values(formik.errors).filter((error) => error !== undefined && !isEmpty(error))
      .length === 0;

  const { amount, asset, account: selectedAccount } = formik.values;
  const convertedAsset = {
    name: asset.name,
    ticker: asset.ticker,
    uuid: asset.uuid
  };
  const filteredAccounts = getAccountsWithAssetBalance(relevantAccounts, convertedAsset, amount);

  useEffect(() => {
    if (
      amount &&
      asset &&
      selectedAccount &&
      !getAccountsWithAssetBalance(filteredAccounts, convertedAsset, amount).find(
        (a) => a.uuid === selectedAccount.uuid
      )
    ) {
      formik.setFieldValue('account', undefined);
    }
  }, [amount, asset]);

  return (
    <div>
      <form>
        <FormFieldItem>
          <FormFieldLabel htmlFor="account">{translate('SELECT_YOUR_ACCOUNT')}</FormFieldLabel>
          <AccountSelector
            name={'account'}
            value={formik.values.account}
            accounts={filteredAccounts}
            asset={formik.values.asset}
            onSelect={(option: IAccount) => {
              handleAccountChange(option);
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
                asset={formik.values.asset}
                value={formik.values.amount}
                onChange={noOp}
                onBlur={() => {
                  formik.setFieldTouched('amount');
                  //handleGasEstimate();
                }}
                placeholder={'0.00'}
              />
              {formik.errors && formik.errors.amount && formik.touched && formik.touched.amount ? (
                <InlineMessage className="SendAssetsForm-errors">
                  {formik.errors.amount}
                </InlineMessage>
              ) : null}
            </Tooltip>
          </>
        </FormFieldItem>
        <FormFieldSubmitButton
          type="submit"
          loading={isSubmitting}
          onClick={() => {
            if (isValid) {
              fetchGasPriceEstimates(formik.values.network).then(({ fast }) => {
                onComplete({ ...formik.values, gasPrice: fast.toString() });
              });
            }
          }}
        >
          {translateRaw('REP_TOKEN_MIGRATION')}
        </FormFieldSubmitButton>
      </form>
    </div>
  );
};

export default TokenMigrationForm;
