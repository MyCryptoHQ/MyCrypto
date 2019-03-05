import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { account } from 'v2/services/Account';
import { AccountContext } from 'v2/providers/AccountProvider';

import ToolsAccountList from './ToolsAccountList';

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
      {({ accounts, createAccount, removeAccount }) => (
        <DevToolsContainer>
          <Panel>
            <ToolsAccountList accounts={accounts} removeAccount={removeAccount} />
            <div className="Settings-heading">Enter a new Account</div>
            <Formik
              initialValues={{
                address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
                label: 'test1',
                network: 'ETH'
              }}
              onSubmit={(values: account, { setSubmitting }) => {
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
                      render={({ field }: { field: any }) => (
                        <DevToolsInput
                          {...field}
                          component={DevToolsInput}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values['address']}
                        />
                      )}
                    />
                  </fieldset>

                  <br />

                  <fieldset>
                    Label:{' '}
                    <Field
                      name="label"
                      render={({ field }: { field: any }) => (
                        <DevToolsInput
                          {...field}
                          component={DevToolsInput}
                          onChange={handleChange} //({ target: { value } }: { target: { value: any }}) => form.setFieldValue(field.name, value)}
                          onBlur={handleBlur}
                          value={values['label']}
                        />
                      )}
                    />
                  </fieldset>

                  <br />

                  <fieldset>
                    Network:{' '}
                    <Field
                      name="network"
                      render={({ field }: { field: any }) => (
                        <DevToolsInput
                          {...field}
                          component={DevToolsInput}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values['network']}
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
      )}
    </AccountContext.Consumer>
  );
};

export default DevTools;
