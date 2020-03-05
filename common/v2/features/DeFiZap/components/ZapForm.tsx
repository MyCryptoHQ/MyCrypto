import React, { useContext } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button } from '@mycrypto/ui';
import { isEmpty } from 'lodash';

import { StoreContext, AssetContext, getNonce, NetworkContext, fetchGasPriceEstimates } from 'v2';
import translate from 'v2/translations';
import { SPACING } from 'v2/theme';
import { IAccount, Network, StoreAccount, Asset } from 'v2/types';
import { AccountDropdown, InlineMessage, AmountInput } from 'v2/components';
import { validateAmountField } from 'v2/features/SendAssets/components/validators/validators';
import { isEthereumAccount } from 'v2/services/Store/Account/helpers';

import { ZapInteractionState, ISimpleTxFormFull } from '../types';
import ZapSelectedBanner from './ZapSelectedBanner';
import DeFiZapLogo from './DeFiZapLogo';
import { IZapConfig } from '../config';

interface Props extends ZapInteractionState {
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
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

export const EtherUUID = '356a192b-7913-504c-9457-4d18c28d46e6';

const ZapForm = ({ onComplete, zapSelected }: Props) => {
  const { accounts } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const ethAsset = assets.find(asset => asset.uuid === EtherUUID) as Asset;
  const network = networks.find(n => n.baseAsset === EtherUUID) as Network;
  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <ZapFormUI
      ethAsset={ethAsset}
      network={network}
      zapSelected={zapSelected as IZapConfig}
      relevantAccounts={relevantAccounts}
      onComplete={onComplete}
    />
  );
};

interface UIProps {
  ethAsset: Asset;
  network: Network;
  zapSelected: IZapConfig;
  relevantAccounts: StoreAccount[];
  onComplete(fields: any): void;
}

export const ZapFormUI = ({
  ethAsset,
  network,
  zapSelected,
  relevantAccounts,
  onComplete
}: UIProps) => {
  const initialFormikValues: ISimpleTxFormFull = {
    account: {} as StoreAccount,
    amount: '',
    asset: ethAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network
  };

  return (
    <div>
      <Formik
        initialValues={initialFormikValues}
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
              {zapSelected && <ZapSelectedBanner zapSelected={zapSelected} />}
              <FormFieldItem>
                <FormFieldLabel htmlFor="account">{translate('X_SENDER')}</FormFieldLabel>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
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
                <Field
                  name="amount"
                  validate={validateAmountField}
                  render={({ field, form }: FieldProps) => {
                    return (
                      <>
                        <AmountInput
                          {...field}
                          asset={ethAsset}
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
                Continue on!
              </FormFieldSubmitButton>
              <DeFiZapLogoContainer>
                <DeFiZapLogo />
              </DeFiZapLogoContainer>
            </Form>
          );
        }}
      />
    </div>
  );
};

export default ZapForm;
