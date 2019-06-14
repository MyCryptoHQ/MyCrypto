import noop from 'lodash/noop';
import React, { useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { ComboBox, Copyable, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AccountContext } from 'v2/providers';
import './ReceiveAssets.scss';
import { getNetworkByName } from 'v2/libs/networks/networks';

import QRCode from './components/QRCode';
// import AccountDropdown from './components/AccountDropdown';
// Legacy
import receiveIcon from 'common/assets/images/icn-receive.svg';

const initialValues = {
  recipientAddress: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
  amount: '1.00',
  asset: 'ETH',
  chainId: 1
};

const truncate = (children: string) => {
  return [children.substring(0, 15), '…', children.substring(children.length - 10)].join('');
};

export const buildEIP681EtherRequest = (
  recipientAddr: string,
  chainId: number,
  etherValue: string
) => `ethereum:${recipientAddr}${chainId !== 1 ? `@${chainId}` : ''}?value=${etherValue}e18`;

const QRDisplay = styled.div`
  margin: auto;
  width: 60%;
`;

export function ReceiveAssets({ history }: RouteComponentProps<{}>) {
  const { accounts } = useContext(AccountContext);
  console.log(accounts);
  const network = getNetworkByName(accounts[0].network);
  console.log(network);

  return (
    <Layout className="RequestAssets" centered={true}>
      <ContentPanel
        heading="Receive Assets"
        icon={receiveIcon}
        onBack={history.goBack}
        className="RequestAssets-panel"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={noop}
          render={({ values: { amount } }: FormikProps<typeof initialValues>) => (
            <Form>
              <fieldset className="RequestAssets-panel-fieldset">
                <label htmlFor="recipientAddress">Recipient Address</label>
                <Field
                  name="recipientAddress"
                  render={({ field }: FieldProps<typeof initialValues>) => (
                    <Input
                      {...field}
                      disabled={true}
                      className="RequestAssets-panel-fieldset-input"
                    />
                    // <AccountDropdown
                    //   values={values}
                    //   name={field.name}
                    //   value={field.value}
                    //   accounts={accounts}
                    //   onSelect={(option: IExtendedAccount) => {
                    //     form.setFieldValue(field.name, option);
                    //     updateState({ transactionFields: { account: option } });
                    //   }}
                    // />
                  )}
                />
              </fieldset>
              <div className="RequestAssets-panel-fieldset RequestAssets-panel-amountAsset">
                <div className="RequestAssets-panel-amountAsset-amount">
                  <label htmlFor="amount" className="RequestAssets-panel-amountAsset-amount-label">
                    Amount
                  </label>
                  <Field
                    name="amount"
                    render={({ field, form }: FieldProps<typeof initialValues>) => (
                      <Input
                        value={field.value}
                        onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                        placeholder="0.00"
                        className="SendAssetsForm-fieldset-input"
                      />
                    )}
                  />
                </div>
                <div className="RequestAssets-panel-amountAsset-asset">
                  <label htmlFor="asset">Asset</label>
                  <Field
                    name="asset"
                    render={({ field }: FieldProps<typeof initialValues>) => (
                      <ComboBox
                        value={field.value}
                        items={new Set(['ETH', 'ZRX'])}
                        className="SendAssetsForm-fieldset-input"
                      />
                    )}
                  />
                </div>
              </div>
              {parseFloat(amount) > 0 && (
                <>
                  <div className="RequestAssets-panel-divider" />
                  <fieldset className="RequestAssets-panel-fieldset">
                    <label>Payment Code</label>
                    <div className="RequestAssets-panel-fieldset-box">
                      <Copyable
                        text={buildEIP681EtherRequest(
                          initialValues.recipientAddress,
                          initialValues.chainId,
                          amount
                        )}
                        truncate={truncate}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="RequestAssets-panel-fieldset">
                    <label>QR Code</label>
                    <QRDisplay>
                      <QRCode
                        data={buildEIP681EtherRequest(
                          accounts[0].address,
                          network ? network.chainId : 1,
                          amount
                        )}
                      />
                    </QRDisplay>
                  </fieldset>
                </>
              )}
            </Form>
          )}
        />
      </ContentPanel>
    </Layout>
  );
}

export default withRouter(ReceiveAssets);
