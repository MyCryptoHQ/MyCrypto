import noop from 'lodash/noop';
import React, { useContext, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { ComboBox, Copyable, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AccountContext } from 'v2/providers';
import './ReceiveAssets.scss';
import { getNetworkByName } from 'v2/libs/networks/networks';
import { ExtendedAccount as IExtendedAccount } from 'v2/services';

import QRCode from './components/QRCode';
import AccountDropdown from './components/AccountDropdown';
// Legacy
import receiveIcon from 'common/assets/images/icn-receive.svg';

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
  const network = getNetworkByName(accounts[0].network);
  const [requestAddress, setRequestAddress] = useState('');

  const initialValues = {
    recipientAddress: accounts[0].address,
    amount: '0',
    asset: 'ETH',
    chainId: network ? network.chainId : 1
  };

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
          render={({ values: { amount, chainId } }: FormikProps<typeof initialValues>) => (
            <Form>
              <fieldset className="RequestAssets-panel-fieldset">
                <label htmlFor="recipientAddress">Recipient Address</label>
                <Field
                  name="recipientAddress"
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
                      name={field.name}
                      value={field.value}
                      accounts={accounts}
                      onSelect={(option: IExtendedAccount) => {
                        form.setFieldValue(field.name, option);
                        setRequestAddress(option.address);
                      }}
                    />
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
                        text={buildEIP681EtherRequest(requestAddress, chainId, amount)}
                        truncate={truncate}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="RequestAssets-panel-fieldset">
                    <label>QR Code</label>
                    <QRDisplay>
                      <QRCode
                        data={buildEIP681EtherRequest(
                          requestAddress,
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
