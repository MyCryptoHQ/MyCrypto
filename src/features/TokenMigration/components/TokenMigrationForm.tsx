import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import * as Yup from 'yup';
import { bigNumberify } from 'ethers/utils';

import translate, { translateRaw } from '@translations';
import { SPACING } from '@theme';
import { IAccount, Network, StoreAccount, Asset } from '@types';
import { AccountSelector, InlineMessage, AmountInput, Button, Tooltip } from '@components';
import { validateAmountField } from '@features/SendAssets/components/validators/validators';
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

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initialFormikValues}
        validationSchema={TokenMigrationFormSchema}
        onSubmit={noOp}
        render={({ values, errors, touched, setFieldValue }) => {
          const handleAccountChange = (account: IAccount) => {
            const accountAssetAmt = account.assets.find(
              (a) => a.uuid === tokenMigrationConfig.fromAssetUuid
            );
            if (!accountAssetAmt) {
              return;
            }
            setFieldValue(
              'amount',
              weiToFloat(bigNumberify(accountAssetAmt.balance), asset.decimal).toString()
            ); // this would be better as a reducer imo.
            setFieldValue('account', account); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object

            handleNonceEstimate(account);
          };
          const handleNonceEstimate = async (account: IAccount) => {
            const nonce: number = await getNonce(values.network, account.address);
            setFieldValue('nonce', nonce);
          };
          const isValid =
            Object.values(errors).filter((error) => error !== undefined && !isEmpty(error))
              .length === 0;

          const { amount, asset, account: selectedAccount } = values;
          const convertedAsset = {
            name: asset.name,
            ticker: asset.ticker,
            uuid: asset.uuid
          };
          const filteredAccounts = getAccountsWithAssetBalance(
            relevantAccounts,
            convertedAsset,
            amount
          );

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

          return (
            <Form>
              <FormFieldItem>
                <FormFieldLabel htmlFor="account">
                  {translate('SELECT_YOUR_ACCOUNT')}
                </FormFieldLabel>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field }: FieldProps) => (
                    <AccountSelector
                      name={field.name}
                      value={field.value}
                      accounts={filteredAccounts}
                      asset={values.asset}
                      onSelect={(option: IAccount) => {
                        handleAccountChange(option);
                      }}
                    />
                  )}
                />
                {filteredAccounts.length === 0 && (
                  <InlineMessage>{translateRaw('NO_RELEVANT_ACCOUNTS')}</InlineMessage>
                )}
              </FormFieldItem>
              <FormFieldItem>
                <FormFieldLabel htmlFor="amount">
                  <div>{translate('SEND_ASSETS_AMOUNT_LABEL')}</div>
                </FormFieldLabel>
                <Field
                  name="amount"
                  validate={validateAmountField}
                  render={({ field, form }: FieldProps) => {
                    return (
                      <>
                        <Tooltip
                          tooltip={translateRaw('REP_TOKEN_MIGRATION_AMOUNT_DISABLED_TOOLTIP')}
                        >
                          <AmountInput
                            {...field}
                            disabled={true}
                            asset={values.asset}
                            value={field.value}
                            onBlur={() => {
                              form.setFieldTouched('amount');
                              //handleGasEstimate();
                            }}
                            placeholder={'0.00'}
                          />
                          {errors && errors.amount && touched && touched.amount ? (
                            <InlineMessage className="SendAssetsForm-errors">
                              {errors.amount}
                            </InlineMessage>
                          ) : null}
                        </Tooltip>
                      </>
                    );
                  }}
                />
              </FormFieldItem>
              <FormFieldSubmitButton
                type="submit"
                loading={isSubmitting}
                onClick={() => {
                  if (isValid) {
                    fetchGasPriceEstimates(values.network).then(({ fast }) => {
                      onComplete({ ...values, gasPrice: fast.toString() });
                    });
                  }
                }}
              >
                {translateRaw('REP_TOKEN_MIGRATION')}
              </FormFieldSubmitButton>
            </Form>
          );
        }}
      />
    </div>
  );
};

export default TokenMigrationForm;
