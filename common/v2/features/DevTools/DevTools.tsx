import React from 'react';
import { Formik } from 'formik';
import { List, Address, Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import './DevTools.scss';
import AccountServiceBase from 'v2/services/Account/Account';
import { account, extendedAccount } from 'v2/services/Account';
import { truncate } from 'v2/libs';

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

export default function DevTools() {
  const Account = new AccountServiceBase();
  const accounts: extendedAccount[] = Account.readAccounts() || [];

  const list = accounts.map((account: extendedAccount) => {
    return (
      <AccountContainer>
        <Address title={account.label} address={account.address} truncate={truncate} />
        <DeleteButton onClick={() => Account.deleteAccount(account.uuid)} icon="exit" />
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
            Account.createAccount(values);
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              Address:{' '}
              <DevToolsInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['address']}
              />
              <br />
              Label:{' '}
              <DevToolsInput onChange={handleChange} onBlur={handleBlur} value={values['label']} />
              <br />
              Network:{' '}
              <DevToolsInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['network']}
              />
              <br />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
          )}
        </Formik>
      </Panel>
    </DevToolsWidget>
  );
}
