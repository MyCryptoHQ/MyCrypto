import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { ComboBox, Copyable, Input } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import './RequestAssets.scss';

// Legacy
import receiveIcon from 'common/assets/images/icn-receive.svg';

const truncate = (children: string) => {
  return [children.substring(0, 15), '…', children.substring(children.length - 10)].join('');
};

export function RequestAssets({ history }: RouteComponentProps<{}>) {
  return (
    <Layout className="RequestAssets" centered={true}>
      <ContentPanel
        heading="Request Assets"
        icon={receiveIcon}
        onBack={history.goBack}
        className="RequestAssets-panel"
      >
        <Formik
          initialValues={{
            recipientAddress: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
            amount: '0.00',
            asset: 'ETH'
          }}
          onSubmit={() => {}}
          render={({ values: { amount } }) => (
            <Form>
              <fieldset className="RequestAssets-panel-fieldset">
                <label htmlFor="recipientAddress">Recipient Address</label>
                <Field
                  name="recipientAddress"
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled={true}
                      className="RequestAssets-panel-fieldset-input"
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
                    render={({ field, form }) => (
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
                    render={({ field }) => (
                      <ComboBox
                        value={field.value}
                        items={['ETH', 'ZRX']}
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
                        text="ethereum:0x80200997f095da94e404f7e0d581aab1ffba9f7d?value=2e18"
                        truncate={truncate}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="RequestAssets-panel-fieldset">
                    <label>QR Code</label>
                    <div className="RequestAssets-panel-fieldset-box">(QR code goes here)</div>
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

export default withRouter(RequestAssets);
