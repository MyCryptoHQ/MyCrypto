import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import * as Yup from 'yup';

import translate, { translateRaw } from '@translations';
import { SPACING } from '@theme';
import { IAccount, Network, StoreAccount, Asset, TSymbol, TUuid } from '@types';
import { AccountDropdown, InlineMessage, AmountInput, Button } from '@components';
import { validateAmountField } from '@features/SendAssets/components/validators/validators';
import { isEthereumAccount } from '@services/Store/Account/helpers';
import { StoreContext, AssetContext, NetworkContext } from '@services/Store';
import { fetchGasPriceEstimates } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { ETHUUID, noOp } from '@utils';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';

import MembershipSelector from './MembershipSelector';
import { MembershipPurchaseState, MembershipSimpleTxFormFull } from '../types';
import { IMembershipId, IMembershipConfig, MEMBERSHIP_CONFIG } from '../config';

interface Props extends MembershipPurchaseState {
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

const MembershipForm = ({ isSubmitting, onComplete }: Props) => {
  const { accounts } = useContext(StoreContext);
  const { networks } = useContext(NetworkContext);
  const network = networks.find((n) => n.baseAsset === ETHUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <MembershipFormUI
      isSubmitting={isSubmitting}
      network={network}
      relevantAccounts={relevantAccounts}
      onComplete={onComplete}
    />
  );
};

export const MembershipFormUI = ({
  isSubmitting,
  network,
  relevantAccounts,
  onComplete
}: UIProps) => {
  const { getAssetByUUID } = useContext(AssetContext);
  const defaultMembership = MEMBERSHIP_CONFIG[IMembershipId.sixmonths];
  const defaultAsset = (getAssetByUUID(defaultMembership.assetUUID as TUuid) || {}) as Asset;
  const initialFormikValues: MembershipSimpleTxFormFull = {
    membershipSelected: defaultMembership,
    account: {} as StoreAccount,
    amount: defaultMembership.price,
    asset: defaultAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network
  };

  const MembershipFormSchema = Yup.object().shape({
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
        validationSchema={MembershipFormSchema}
        onSubmit={noOp}
        render={({ values, errors, touched, setFieldValue }) => {
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
            symbol: asset.ticker as TSymbol,
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
                <FormFieldLabel htmlFor="membershipSelected">
                  {translate('SELECT_MEMBERSHIP')}
                </FormFieldLabel>
                <Field
                  name="membershipSelected"
                  value={values.membershipSelected}
                  component={({ field, form }: FieldProps) => (
                    <MembershipSelector
                      name={field.name}
                      value={field.value}
                      onSelect={(option: IMembershipConfig) => {
                        // if this gets deleted, it no longer shows as selected on interface,
                        // would like to set only object keys that are needed instead of full object
                        form.setFieldValue('membershipSelected', option);
                        form.setFieldValue('amount', option.price);
                        form.setFieldValue('asset', getAssetByUUID(option.assetUUID as TUuid));
                      }}
                    />
                  )}
                />
              </FormFieldItem>
              <FormFieldItem>
                <FormFieldLabel htmlFor="account">
                  {translate('SELECT_YOUR_ACCOUNT')}
                </FormFieldLabel>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
                      name={field.name}
                      value={field.value}
                      accounts={filteredAccounts}
                      asset={values.asset}
                      onSelect={(option: IAccount) => {
                        form.setFieldValue('account', option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                        handleNonceEstimate(option);
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
                {translateRaw('BUY_MEMBERSHIP')}
              </FormFieldSubmitButton>
            </Form>
          );
        }}
      />
    </div>
  );
};

export default MembershipForm;
