import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Button, ComboBox, Heading, Input, Typography } from '@mycrypto/ui';

import { ContentPanel, Layout } from 'v2/components';
import './SendAssets.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';

export function SendAssets({ history }: RouteComponentProps<{}>) {
  return (
    <Layout className="SendAssets">
      <ContentPanel onBack={history.goBack} className="SendAssets-panel">
        <Heading className="SendAssets-panel-heading">Send Assets</Heading>
        <Formik
          initialValues={{
            senderAddress: '',
            recipientAddress: '',
            amount: '0.00',
            asset: 'ETH',
            transactionFee: '',
            gasPrice: '',
            gasLimit: '',
            nonce: ''
          }}
          onSubmit={console.log}
          render={() => (
            <Form>
              <fieldset className="SendAssets-panel-fieldset">
                <label htmlFor="senderAddress">Select an Existing Address</label>
                <Field
                  name="senderAddress"
                  render={({ field }) => (
                    <ComboBox
                      value={field.value}
                      items={['a', 'b', 'c']}
                      className="SendAssets-panel-fieldset-input"
                    />
                  )}
                />
              </fieldset>
              <fieldset className="SendAssets-panel-fieldset">
                <label htmlFor="recipientAddress">Recipient Address</label>
                <Field
                  name="recipientAddress"
                  render={({ field, form }) => (
                    <Input
                      value={field.value}
                      onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                      placeholder="Enter an Address or Contact"
                      className="SendAssets-panel-fieldset-input"
                    />
                  )}
                />
              </fieldset>
              <div className="SendAssets-panel-fieldset SendAssets-panel-amountAsset">
                <div className="SendAssets-panel-amountAsset-amount">
                  <label htmlFor="amount" className="SendAssets-panel-amountAsset-amount-label">
                    <div>Amount</div>
                    <div className="SendAssets-panel-amountAsset-amount-label-sendMax">
                      send max
                    </div>
                  </label>
                  <Field
                    name="amount"
                    render={({ field, form }) => (
                      <Input
                        value={field.value}
                        onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                        placeholder="0.00"
                        className="SendAssets-panel-fieldset-input"
                      />
                    )}
                  />
                </div>
                <div className="SendAssets-panel-amountAsset-asset">
                  <label htmlFor="asset">Asset</label>
                  <Field
                    name="asset"
                    render={({ field }) => (
                      <ComboBox
                        value={field.value}
                        items={['ETH', 'ZRX']}
                        className="SendAssets-panel-fieldset-input"
                      />
                    )}
                  />
                </div>
              </div>
              <fieldset className="SendAssets-panel-fieldset SendAssets-panel-fieldset-youllSend">
                <label>You'll Send</label>
                <div className="SendAssets-panel-fieldset-youllSend-box">
                  <Heading as="h2" className="SendAssets-panel-fieldset-youllSend-box-crypto">
                    <img src={sendIcon} alt="Send" /> 13.233333 ETH
                  </Heading>
                  <small className="SendAssets-panel-fieldset-youllSend-box-fiat">
                    ≈ $1440.00 USD
                  </small>
                  <div className="SendAssets-panel-fieldset-youllSend-box-conversion">
                    <Typography>
                      Conversion Rate <br />
                      1 ETH ≈ $109.41 USD
                    </Typography>
                  </div>
                </div>
              </fieldset>
              <fieldset className="SendAssets-panel-fieldset">
                <label
                  htmlFor="transactionFee"
                  className="SendAssets-panel-fieldset-transactionFee"
                >
                  <div>Transaction Fee</div>
                  <div>0.000273 / $0.03 USD</div>
                </label>
                <div className="SendAssets-panel-fieldset-rangeWrapper">
                  <div className="SendAssets-panel-fieldset-rangeWrapper-cheap" />
                  <Field name="transactionFee" type="range" min="0" max="100" />
                  <div className="SendAssets-panel-fieldset-rangeWrapper-fast" />
                </div>
                <div className="SendAssets-panel-fieldset-cheapFast">
                  <div>Cheap</div>
                  <div>Fast</div>
                </div>
              </fieldset>
              <div className="SendAssets-panel-advancedOptions">
                <Button basic={true} className="SendAssets-panel-advancedOptions-button">
                  Show Advanced Options
                </Button>
              </div>
              <Button className="SendAssets-panel-next">Next</Button>
            </Form>
          )}
        />
      </ContentPanel>
    </Layout>
  );
}

export default withRouter(SendAssets);
