import { parseEther } from '@ethersproject/units';
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
  InlineMessage,
  PoweredByText
} from '@components';
import { ETHUUID } from '@config';
import { validateAmountField } from '@features/SendAssets/components/validators/validators';
import { fetchGasPriceEstimates } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { getAccountBalance, useAssets } from '@services/Store';
import { isEthereumAccount } from '@services/Store/Account/helpers';
import { useNetworks } from '@services/Store/Network';
import { AppState, getDefaultAccount, getIsDemoMode, getStoreAccounts, useSelector } from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, IAccount, ISimpleTxFormFull, Network, StoreAccount } from '@types';

import { IZapConfig } from '../config';
import { ZapInteractionState } from '../types';
import ZapSelectedBanner from './ZapSelectedBanner';

interface ZapProps extends ZapInteractionState {
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  ethAsset: Asset;
  network: Network;
  zapSelected: IZapConfig;
  relevantAccounts: StoreAccount[];
  defaultAccount?: StoreAccount;
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

const DeFiZapLogoContainer = styled.div`
  margin-top: ${SPACING.BASE};
`;

const ZapForm = ({ onComplete, zapSelected, isDemoMode }: Props) => {
  const accounts = useSelector(getStoreAccounts);
  const defaultAccount = useSelector(getDefaultAccount());
  const { assets } = useAssets();
  const { networks } = useNetworks();
  const ethAsset = assets.find((asset) => asset.uuid === ETHUUID) as Asset;
  const network = networks.find((n) => n.baseAsset === ETHUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <ZapFormUI
      ethAsset={ethAsset}
      network={network}
      zapSelected={zapSelected as IZapConfig}
      relevantAccounts={relevantAccounts}
      defaultAccount={defaultAccount}
      isDemoMode={isDemoMode}
      onComplete={onComplete}
    />
  );
};

export const ZapFormUI = ({
  ethAsset,
  network,
  zapSelected,
  relevantAccounts,
  defaultAccount,
  isDemoMode,
  onComplete
}: UIProps) => {
  const initialFormikValues: Overwrite<ISimpleTxFormFull, { account?: StoreAccount }> = {
    account: defaultAccount,
    amount: '',
    asset: ethAsset,
    nonce: '0',
    gasPrice: '10',
    address: '',
    gasLimit: '',
    network,
    maxFeePerGas: '20',
    maxPriorityFeePerGas: '1'
  };

  const ZapFormSchema = object().shape({
    amount: number()
      .min(0, translateRaw('ERROR_0'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_0'))
      .test(
        'check-amount',
        translateRaw('BALANCE_TOO_LOW_NO_RECOMMENDATION_ERROR', { $asset: ethAsset.ticker }),
        function (value) {
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
      .test(validateAmountField())
  });

  return (
    <div>
      {isDemoMode && <DemoGatewayBanner />}
      <Formik
        initialValues={initialFormikValues}
        validationSchema={ZapFormSchema}
        onSubmit={(fields) => {
          fetchGasPriceEstimates(fields.network).then(({ standard }) => {
            onComplete({ ...fields, gasPrice: standard.toString() });
          });
        }}
      >
        {({ values, errors, touched, setFieldValue }) => {
          const handleNonceEstimate = async (account: IAccount) => {
            const nonce: number = await getNonce(values.network, account.address);
            setFieldValue('nonce', nonce);
          };

          return (
            <Form>
              {zapSelected && <ZapSelectedBanner zapSelected={zapSelected} />}
              <FormFieldItem>
                <FormFieldLabel htmlFor="account">{translate('X_SENDER')}</FormFieldLabel>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field, form }: FieldProps) => (
                    <AccountSelector
                      name={field.name}
                      value={field.value}
                      accounts={relevantAccounts}
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
                <Field name="amount">
                  {({ field, form }: FieldProps) => (
                    <>
                      <AmountInput
                        {...field}
                        asset={ethAsset}
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
              <FormFieldSubmitButton disabled={isDemoMode} type="submit">
                {translateRaw('ACTION_6')}
              </FormFieldSubmitButton>
              <DeFiZapLogoContainer>
                <PoweredByText provider="ZAPPER" />
              </DeFiZapLogoContainer>
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
type Props = ConnectedProps<typeof connector> & ZapProps;

export default connector(ZapForm);
