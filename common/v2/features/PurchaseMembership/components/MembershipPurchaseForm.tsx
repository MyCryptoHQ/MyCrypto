import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button } from '@mycrypto/ui';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { parseEther } from 'ethers/utils';

import translate, { translateRaw } from 'v2/translations';
import { SPACING } from 'v2/theme';
import { IAccount, Network, StoreAccount, Asset, TSymbol } from 'v2/types';
import { AccountDropdown, InlineMessage, AmountInput } from 'v2/components';
import { validateAmountField } from 'v2/features/SendAssets/components/validators/validators';
import { isEthereumAccount } from 'v2/services/Store/Account/helpers';
import { StoreContext, AssetContext, NetworkContext, getAccountBalance } from 'v2/services/Store';
import { fetchGasPriceEstimates } from 'v2/services/ApiService';
import { getNonce } from 'v2/services/EthService';
import { EtherUUID } from 'v2/utils';
import { getAccountsWithAssetBalance } from 'v2/features/SwapAssets/helpers';

import MembershipDropdown from './MembershipDropdown';
import { MembershipPurchaseState, MembershipSimpleTxFormFull } from '../types';
import { IMembershipId, IMembershipConfig, MEMBERSHIP_CONFIG } from '../config';

interface Props extends MembershipPurchaseState {
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  network: Network;
  relevantAccounts: StoreAccount[];
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

const MembershipForm = ({ onComplete }: Props) => {
  const { accounts } = useContext(StoreContext);
  const { networks } = useContext(NetworkContext);
  const network = networks.find(n => n.baseAsset === EtherUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <MembershipFormUI
      network={network}
      relevantAccounts={relevantAccounts}
      onComplete={onComplete}
    />
  );
};

export const MembershipFormUI = ({ network, relevantAccounts, onComplete }: UIProps) => {
  const { assets } = useContext(AssetContext);
  const defaultMembership = MEMBERSHIP_CONFIG[IMembershipId.onemonth];
  const defaultAsset = assets.find(asset => asset.uuid === defaultMembership.assetUUID) as Asset;
  const [selectedAsset, setSelectedAsset] = useState(defaultAsset);
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
      .test(
        'check-amount',
        translateRaw('BALANCE_TOO_LOW_NO_RECOMMENDATION_ERROR', { $asset: selectedAsset.ticker }),
        function(value) {
          const account = this.parent.account;
          const asset = this.parent.asset;
          const val = value ? value : 0;
          if (!isEmpty(account)) {
            return getAccountBalance(account, asset.type === 'base' ? undefined : asset).gte(
              parseEther(val.toString())
            );
          }
          return true;
        }
      )
  });

  return (
    <div>
      <Formik
        initialValues={initialFormikValues}
        validationSchema={MembershipFormSchema}
        onSubmit={fields => {
          fetchGasPriceEstimates(fields.network).then(({ fast }) => {
            onComplete({ ...fields, gasPrice: fast.toString() });
          });
        }}
        render={({ values, errors, touched, setFieldValue }) => {
          const handleNonceEstimate = async (account: IAccount) => {
            const nonce: number = await getNonce(values.network, account.address);
            setFieldValue('nonce', nonce);
          };
          const isValid =
            Object.values(errors).filter(error => error !== undefined && !isEmpty(error)).length ===
            0;

          const { amount, asset, account: selectedAccount } = values;
          const convertedAsset = { name: asset.name, symbol: asset.ticker as TSymbol };
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
                a => a.uuid === selectedAccount.uuid
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
                    <MembershipDropdown
                      name={field.name}
                      value={{ value: field.value, label: field.value.title }}
                      onSelect={(option: { label: string; value: IMembershipConfig }) => {
                        form.setFieldValue('membershipSelected', option.value); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                        form.setFieldValue('amount', option.value.price);
                        const newAsset = assets.find(
                          a => a.uuid === option.value.assetUUID
                        ) as Asset;
                        form.setFieldValue('asset', newAsset);
                        setSelectedAsset(newAsset);
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
                onClick={() => {
                  if (isValid) {
                    onComplete(values);
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
