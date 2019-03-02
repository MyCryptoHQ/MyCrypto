import React, { useEffect, useContext } from 'react';
import { Formik, Field, Form } from 'formik';
import { List, Address, Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { account, extendedAccount } from 'v2/services/Account';
import { truncate } from 'v2/libs';
import { AccountContext } from 'v2/providers/AccountProvider';

// const AccountsContext = React.createContext({});

const DevToolsWidget = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  border: 1px solid gray;
`;

const AccountContainer = styled.div`
  display: flex;
  font-size: 18px;
`;

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

const DevToolsInput = styled(Input)`
  font-size: 1em;
`;

const DevTools = () => {
  const accountData = useContext(AccountContext);

  const accountList = accountData.accounts;
  const { addAccount, removeAccount } = accountData;
  console.log(accountList);
  console.log(accountData);
  const list = accountList.map((account: extendedAccount) => {
    return (
      <AccountContainer>
        <Address title={account.label} address={account.address} truncate={truncate} />
        <DeleteButton onClick={() => removeAccount(account.uuid)} icon="exit" />
      </AccountContainer>
    );
  });

  return (
    <DevToolsWidget>
      <Panel>
        <List group>{list}</List>
        <div className="Settings-heading">Enter a new Account</div>
        <Formik
          initialValues={{
            address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
            label: 'test1',
            network: 'ETH'
          }}
          onSubmit={(values: account, { setSubmitting }) => {
            addAccount(values);
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
    </DevToolsWidget>
  );
};

export default DevTools;
