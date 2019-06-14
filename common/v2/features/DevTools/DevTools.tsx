import React from 'react';
import { Formik, Field, Form, FieldProps } from 'formik';
import { Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { Account, ExtendedAccount } from 'v2/services/Account';
import { AccountContext } from 'v2/providers/AccountProvider';

import ToolsAccountList from './ToolsAccountList';
import { SecureWalletName } from 'v2/config';
import ToolsNotifications from './ToolsNotifications';
import { AddressBook } from 'v2/services/AddressBook/types';
import { getLabelByAccount } from 'v2/libs/addressbook/addressbook';

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
                  assets: [{ uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a', balance: '0' }],
                  wallet: SecureWalletName.WEB3,
                  balance: 0,
                  timestamp: Date.now(),
                  transactions: [],
                  uuid: '61d84f5e-0efa-46b9-915c-aed6ebe5a4dc',
                  dPath: `m/44'/60'/0'/0/0`
                }}
                onSubmit={(values: ExtendedAccount, { setSubmitting }) => {
                  createAccount(values);
                  setSubmitting(false);
                }}
              >
                {({ values, handleChange, handleBlur, isSubmitting }) => {
                  const detectedLabel: AddressBook | undefined = getLabelByAccount(values);
                  const label = detectedLabel ? detectedLabel.label : 'Unknown Account';
                  return (
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
                              value={label}
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
                  );
                }}
              </Formik>
            </Panel>
          </DevToolsContainer>
        </React.Fragment>
      )}
    </AccountContext.Consumer>
  );
};

export default DevTools;
