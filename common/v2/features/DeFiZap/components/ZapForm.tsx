import React, { useContext } from 'react';
import { Button, AccountDropdown, InlineErrorMsg, AmountInput } from 'v2/components';
import { ZapInteractionState, ISimpleTxFormFull } from '../types';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import translate from 'v2/translations';
import { ExtendedAccount, ExtendedAsset, Network } from 'v2/types';
import { StoreContext, AssetContext, getNonce, NetworkContext, fetchGasPriceEstimates } from 'v2';
import { validateAmountField } from 'v2/features/SendAssets/components/validators/validators';
import { isEthereumAccount } from 'v2/services/Store/Account/helpers';

interface Props extends ZapInteractionState {
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

const UserInputForm = styled.div`
  margin: 0px 24px;
`;

export const EtherUUID = '356a192b-7913-504c-9457-4d18c28d46e6';

const ZapForm = (props: Props) => {
  const { accounts } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const ethAsset = assets.find(asset => asset.uuid === EtherUUID) as ExtendedAsset;
  const network = networks.find(n => n.baseAsset === EtherUUID) as Network;

  const initialFormikValues: ISimpleTxFormFull = {
    account: {} as ExtendedAccount,
    amount: '',
    asset: ethAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network
  };

  const relevantAccounts = accounts.filter(isEthereumAccount);

  return (
    <>
      <UserInputForm>
        <Formik
          initialValues={initialFormikValues}
          onSubmit={fields => {
            fetchGasPriceEstimates(fields.network).then(({ fast }) => {
              console.debug('[here?]: ', fast);
              props.onComplete({ ...fields, gasPrice: fast.toString() });
            });
          }}
          render={({ values, errors, touched, setFieldValue }) => {
            const handleNonceEstimate = async (account: ExtendedAccount) => {
              const nonce: number = await getNonce(values.network, account);
              setFieldValue('nonce', nonce);
            };

            return (
              <Form>
                <fieldset className="SendAssetsForm-fieldset">
                  <label htmlFor="account" className="input-group-header">
                    {translate('X_SENDER')}
                  </label>
                  <Field
                    name="account"
                    value={values.account}
                    component={({ field, form }: FieldProps) => (
                      <AccountDropdown
                        name={field.name}
                        value={field.value}
                        accounts={relevantAccounts}
                        onSelect={(option: ExtendedAccount) => {
                          form.setFieldValue('account', option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                          handleNonceEstimate(option);
                        }}
                      />
                    )}
                  />
                </fieldset>
                <fieldset className="SendAssetsForm-fieldset">
                  <label htmlFor="amount" className="input-group-header label-with-action">
                    <div>{translate('SEND_ASSETS_AMOUNT_LABEL')}</div>
                  </label>
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
                          {errors && touched && touched.amount ? (
                            <InlineErrorMsg className="SendAssetsForm-errors">
                              {errors.amount}
                            </InlineErrorMsg>
                          ) : null}
                        </>
                      );
                    }}
                  />
                </fieldset>
                <div>
                  <Button type="submit">Continue on!</Button>
                </div>
              </Form>
            );
          }}
        />
      </UserInputForm>
    </>
  );
};

export default ZapForm;
