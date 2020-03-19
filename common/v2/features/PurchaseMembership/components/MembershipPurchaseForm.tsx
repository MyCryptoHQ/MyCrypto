import React, { useContext } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button } from '@mycrypto/ui';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { parseEther } from 'ethers/utils';

import translate, { translateRaw } from 'v2/translations';
import { SPACING } from 'v2/theme';
import { IAccount, Network, StoreAccount, Asset } from 'v2/types';
import { AccountDropdown, InlineMessage, AmountInput } from 'v2/components';
import { validateAmountField } from 'v2/features/SendAssets/components/validators/validators';
import { isEthereumAccount } from 'v2/services/Store/Account/helpers';
import { StoreContext, AssetContext, NetworkContext, getAccountBalance } from 'v2/services/Store';
import { fetchGasPriceEstimates } from 'v2/services/ApiService';
import { getNonce } from 'v2/services/EthService';
import { EtherUUID, DAIUUID } from 'v2/utils';

import { MembershipPurchaseState, ISimpleTxFormFull } from '../types';
import { IMembershipId, IMembershipConfig, MEMBERSHIP_CONFIG } from '../config';
import MembershipDropdown from './MembershipDropdown';

interface Props extends MembershipPurchaseState {
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  daiAsset: Asset;
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
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const daiAsset = assets.find(asset => asset.uuid === DAIUUID) as Asset;
  const network = networks.find(n => n.baseAsset === EtherUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <MembershipFormUI
      daiAsset={daiAsset}
      network={network}
      relevantAccounts={relevantAccounts}
      onComplete={onComplete}
    />
  );
};

interface MembershipPurchaseForm extends ISimpleTxFormFull {
  membership: IMembershipConfig;
}

export const MembershipFormUI = ({ daiAsset, network, relevantAccounts, onComplete }: UIProps) => {
  const defaultMembership = MEMBERSHIP_CONFIG[IMembershipId.onemonth];
  const initialFormikValues: MembershipPurchaseForm = {
    membership: defaultMembership,
    account: {} as StoreAccount,
    amount: defaultMembership.price,
    asset: daiAsset,
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
        translateRaw('BALANCE_TOO_LOW_NO_RECOMMENDATION_ERROR', { $asset: daiAsset.ticker }),
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
            const nonce: number = await getNonce(values.network, account);
            setFieldValue('nonce', nonce);
          };
          const isValid =
            Object.values(errors).filter(error => error !== undefined && !isEmpty(error)).length ===
            0;

          return (
            <Form>
              <FormFieldItem>
                <FormFieldLabel htmlFor="membership">
                  {translate('SELECT_MEMBERSHIP')}
                </FormFieldLabel>
                <Field
                  name="membership"
                  value={values.membership}
                  component={({ field, form }: FieldProps) => (
                    <MembershipDropdown
                      name={field.name}
                      value={{ value: field.value, label: field.value.title }}
                      onSelect={(option: { label: string; value: IMembershipConfig }) => {
                        form.setFieldValue('membership', option.value); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                        form.setFieldValue('amount', option.value.price);
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
                      accounts={relevantAccounts}
                      asset={daiAsset}
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
                          asset={daiAsset}
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
