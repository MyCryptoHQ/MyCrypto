import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, ComboBox, Heading, Input, Typography } from '@mycrypto/ui';

import { Transaction } from '../SendAssets';
import './SendAssetsForm.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';

interface Props {
  transaction: Transaction;
  onNext(): void;
  onSubmit(values: Transaction): void;
}

export default function SendAssetsForm({ transaction, onNext, onSubmit }: Props) {
  return (
    <Formik
      initialValues={transaction}
      onSubmit={(values: Transaction) => {
        onSubmit(values);
        onNext();
      }}
      render={({ handleSubmit, setFieldValue, values: { advancedMode } }) => {
        const toggleAdvancedOptions = () => setFieldValue('advancedMode', !advancedMode);

        return (
          <Form onSubmit={handleSubmit} className="SendAssetsForm">
            {/* Sender Address */}
            <fieldset className="SendAssetsForm-fieldset">
              <label htmlFor="senderAddress">Select an Existing Address</label>
              <Field
                name="senderAddress"
                render={({ field }) => (
                  <ComboBox
                    value={field.value}
                    items={['a', 'b', 'c']}
                    className="SendAssetsForm-fieldset-input"
                  />
                )}
              />
            </fieldset>
            {/* Recipient Address */}
            <fieldset className="SendAssetsForm-fieldset">
              <label htmlFor="recipientAddress">Recipient Address</label>
              <Field
                name="recipientAddress"
                render={({ field, form }) => (
                  <Input
                    value={field.value}
                    onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                    placeholder="Enter an Address or Contact"
                    className="SendAssetsForm-fieldset-input"
                  />
                )}
              />
            </fieldset>
            {/* Amount / Asset */}
            <div className="SendAssetsForm-fieldset SendAssetsForm-amountAsset">
              <div className="SendAssetsForm-amountAsset-amount">
                <label htmlFor="amount" className="SendAssetsForm-amountAsset-amount-label">
                  <div>Amount</div>
                  <div className="SendAssetsForm-amountAsset-amount-label-sendMax">send max</div>
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
              <div className="SendAssetsForm-amountAsset-asset">
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
            {/* You'll Send */}
            <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
              <label>You'll Send</label>
              <div className="SendAssetsForm-fieldset-youllSend-box">
                <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
                  <img src={sendIcon} alt="Send" /> 13.233333 ETH
                </Heading>
                <small className="SendAssetsForm-fieldset-youllSend-box-fiat">≈ $1440.00 USD</small>
                <div className="SendAssetsForm-fieldset-youllSend-box-conversion">
                  <Typography>
                    Conversion Rate <br />
                    1 ETH ≈ $109.41 USD
                  </Typography>
                </div>
              </div>
            </fieldset>
            {/* Transaction Fee */}
            <fieldset className="SendAssetsForm-fieldset">
              <label htmlFor="transactionFee" className="SendAssetsForm-fieldset-transactionFee">
                <div>Transaction Fee</div>
                <div>0.000273 / $0.03 USD</div>
              </label>
              <div className="SendAssetsForm-fieldset-rangeWrapper">
                <div className="SendAssetsForm-fieldset-rangeWrapper-cheap" />
                <Field name="transactionFee" type="range" min="0" max="100" />
                <div className="SendAssetsForm-fieldset-rangeWrapper-fast" />
              </div>
              <div className="SendAssetsForm-fieldset-cheapFast">
                <div>Cheap</div>
                <div>Fast</div>
              </div>
            </fieldset>
            {/* Advanced Options */}
            <div className="SendAssetsForm-advancedOptions">
              <Button
                basic={true}
                onClick={toggleAdvancedOptions}
                className="SendAssetsForm-advancedOptions-button"
              >
                {advancedMode ? 'Hide' : 'Show'} Advanced Options
              </Button>
              {advancedMode && (
                <div className="SendAssetsForm-advancedOptions-content">
                  <div className="SendAssetsForm-advancedOptions-content-automaticallyCalculate">
                    <Field name="automaticallyCalculateGasLimit" type="checkbox" />
                    <label htmlFor="automaticallyCalculateGasLimit">
                      Automatically Calculate Gas Limit
                    </label>
                  </div>
                  <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce">
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                      <label htmlFor="gasPrice">Gas Price (gwei)</label>
                      <Field
                        name="gasPrice"
                        render={({ field, form }) => (
                          <Input
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="0"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-limit">
                      <label htmlFor="gasLimit">Gas Limit</label>
                      <Field
                        name="gasLimit"
                        render={({ field, form }) => (
                          <Input
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="150000000"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-nonce">
                      <label htmlFor="nonce">Nonce (?)</label>
                      <Field
                        name="nonce"
                        render={({ field, form }) => (
                          <Input
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="0"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="SendAssetsForm-advancedOptions-content-output">
                    0 + 13000000000 * 1500000 + 20000000000 * (180000 + 53000) = 0.02416 ETH ~=
                    $2.67 USD
                  </div>
                </div>
              )}
            </div>
            <Button type="submit" className="SendAssetsForm-next">
              Next
            </Button>
          </Form>
        );
      }}
    />
  );
}
