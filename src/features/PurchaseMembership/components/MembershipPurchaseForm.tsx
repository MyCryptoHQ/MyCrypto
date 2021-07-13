import { useEffect } from 'react';

import { Field, FieldProps, Form, Formik } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { Overwrite } from 'utility-types';
import { number, object } from 'yup';

import {
  AccountSelector,
  AmountInput,
  Button,
  DemoGatewayBanner,
  InlineMessage
} from '@components';
import { DEFAULT_NETWORK, ETHUUID, XDAI_NETWORK, XDAIUUID } from '@config';
import { validateAmountField } from '@features/SendAssets/components/validators/validators';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';
import { fetchGasPriceEstimates } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { useAssets, useNetworks } from '@services/Store';
import { isAccountInNetwork, isEthereumAccount } from '@services/Store/Account/helpers';
import { AppState, getDefaultAccount, getIsDemoMode, getStoreAccounts, useSelector } from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, IAccount, Network, StoreAccount, TUuid } from '@types';
import { noOp } from '@utils';

import { IMembershipConfig, IMembershipId, MEMBERSHIP_CONFIG } from '../config';
import { MembershipPurchaseState, MembershipSimpleTxFormFull } from '../types';
import MembershipSelector from './MembershipSelector';

interface MembershipProps extends MembershipPurchaseState {
  isSubmitting: boolean;
  error?: Error;
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  relevantNetworks: Network[];
  relevantAccounts: StoreAccount[];
  isSubmitting: boolean;
  error?: CustomError;
  isDemoMode: boolean;
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

const MembershipForm = ({ isSubmitting, error, isDemoMode, onComplete }: Props) => {
  const accounts = useSelector(getStoreAccounts);
  const { networks } = useNetworks();
  const relevantNetworks = networks.filter((n) =>
    [ETHUUID, XDAIUUID].includes(n.baseAsset)
  ) as Network[];
  const relevantAccounts = accounts.filter(
    (account) => isEthereumAccount(account) || isAccountInNetwork(account, XDAI_NETWORK)
  );

  return (
    <MembershipFormUI
      isSubmitting={isSubmitting}
      error={error}
      relevantNetworks={relevantNetworks}
      relevantAccounts={relevantAccounts}
      isDemoMode={isDemoMode}
      onComplete={onComplete}
    />
  );
};

export const MembershipFormUI = ({
  isSubmitting,
  error,
  relevantNetworks,
  relevantAccounts,
  isDemoMode,
  onComplete
}: UIProps) => {
  const { getAssetByUUID } = useAssets();
  const defaultAccount = useSelector(getDefaultAccount());
  const defaultMembership = MEMBERSHIP_CONFIG[IMembershipId.twelvemonths];
  const defaultAsset = (getAssetByUUID(defaultMembership.assetUUID as TUuid) || {}) as Asset;
  const initialFormikValues: Overwrite<MembershipSimpleTxFormFull, { account?: StoreAccount }> = {
    membershipSelected: defaultMembership,
    account: defaultAccount,
    amount: defaultMembership.price,
    asset: defaultAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network: (relevantNetworks.find(({ id }) => id === DEFAULT_NETWORK) as unknown) as Network
  };

  const MembershipFormSchema = object().shape({
    amount: number()
      .min(0, translateRaw('ERROR_0'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_0'))
      .test(validateAmountField())
  });

  return (
    <div>
      {isDemoMode && <DemoGatewayBanner />}
      <Formik
        enableReinitialize={true}
        initialValues={initialFormikValues}
        validationSchema={MembershipFormSchema}
        onSubmit={noOp}
      >
        {({ values, errors, touched, setFieldValue }) => {
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

          // eslint-disable-next-line react-hooks/rules-of-hooks
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
                        const asset = getAssetByUUID(option.assetUUID as TUuid);
                        const network =
                          asset && relevantNetworks.find(({ id }) => asset.networkId === id);
                        // if this gets deleted, it no longer shows as selected on interface,
                        // would like to set only object keys that are needed instead of full object
                        form.setFieldValue('membershipSelected', option);
                        form.setFieldValue('amount', option.price);
                        form.setFieldValue('asset', asset);
                        network && form.setFieldValue('network', network);
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
                    <AccountSelector
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
                <Field name="amount">
                  {({ field, form }: FieldProps) => (
                    <>
                      <AmountInput
                        {...field}
                        disabled={true}
                        asset={values.asset}
                        value={field.value}
                        onBlur={() => {
                          form.setFieldTouched('amount');
                        }}
                        placeholder={'0.00'}
                      />
                      {errors && errors.amount && touched && touched.amount ? (
                        <InlineMessage className="SendAssetsForm-errors">
                          {errors.amount}
                        </InlineMessage>
                      ) : null}
                    </>
                  )}
                </Field>
              </FormFieldItem>
              <FormFieldSubmitButton
                type="submit"
                disabled={isDemoMode || !isValid || !selectedAccount}
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
              {error && (
                <InlineMessage
                  value={translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', {
                    $error: error.reason ? error.reason : error.message
                  })}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & MembershipProps;

export default connector(MembershipForm);
