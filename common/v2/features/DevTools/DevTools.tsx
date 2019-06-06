import React from 'react';
import { Formik, Field, Form, FieldProps } from 'formik';
import { Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { Account, ExtendedAccount } from 'v2/services/Account';
import { AccountContext } from 'v2/providers/AccountProvider';

import ToolsAccountList from './ToolsAccountList';
import { SecureWalletName } from 'v2/config';
import ToolsNotifications from './ToolsNotifications';

const DevToolsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  border: 1px solid gray;
`;

const DevToolsInput = styled(Input)`
  font-size: 1em;
`;

const DevTools = () => {
  return (
    <AccountContext.Consumer>
      {({ accounts, createAccount, deleteAccount }) => (
        <React.Fragment>
          <DevToolsContainer>
            <Panel>
              <ToolsNotifications />
              <ToolsAccountList accounts={accounts} deleteAccount={deleteAccount} />
              <div className="Settings-heading">Enter a new Account</div>
              <Formik
                initialValues={{
                  label: 'Foo',
                  address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
                  network: 'Ethereum',
                  localSettings: '17ed6f49-ff23-4bef-a676-69174c266b37',
                  assets: ['12d3cbf2-de3a-4050-a0c6-521592e4b85a'],
                  accountType: SecureWalletName.WEB3,
                  value: 0,
                  timestamp: Date.now(),
                  transactionHistory: '76b50f76-afb2-4185-ab7d-4d62c0654882',
                  uuid: '61d84f5e-0efa-46b9-915c-aed6ebe5a4dc',
                  derivationPath: `m/44'/60'/0'/0/0`
                }}
                onSubmit={(values: ExtendedAccount, { setSubmitting }) => {
                  createAccount(values);
                  setSubmitting(false);
                }}
              >
                {({ values, handleChange, handleBlur, isSubmitting }) => (
                  <Form>
                    <fieldset>
                      Address:{' '}
                      <Field
                        name="address"
                        render={({ field }: FieldProps<Account>) => (
                          <DevToolsInput
                            {...field}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address}
                          />
                        )}
                      />
                    </fieldset>

                    <br />

                    <fieldset>
                      Label:{' '}
                      <Field
                        name="label"
                        render={({ field }: FieldProps<Account>) => (
                          <DevToolsInput
                            {...field}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.label}
                          />
                        )}
                      />
                    </fieldset>

                    <br />

                    <fieldset>
                      Network:{' '}
                      <Field
                        name="network"
                        render={({ field }: FieldProps<Account>) => (
                          <DevToolsInput
                            {...field}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.network}
                          />
                        )}
                      />
                    </fieldset>

                    <br />

                    <Button type="submit" disabled={isSubmitting}>
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </Panel>
          </DevToolsContainer>
        </React.Fragment>
      )}
    </AccountContext.Consumer>
  );
};

export default DevTools;
