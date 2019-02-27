import React from 'react';
import { Formik } from 'formik';
import { List, Address } from '@mycrypto/ui';

import './DevTools.scss';
import AccountServiceBase from 'v2/services/Account/Account';
import { account, extendedAccount } from 'v2/services/Account';
import { truncate } from 'v2/libs';

export default function DevTools() {
  const Account = new AccountServiceBase();
  const accounts: extendedAccount[] = Account.readAccounts() || [];

  const list = accounts.map((account: extendedAccount) => {
    return (
      <p>
        <Address title={account.label} address={account.address} truncate={truncate} />{' '}
        <button onClick={() => Account.deleteAccount(account.uuid)}> x </button>
      </p>
    );
  });

  return (
    <div className="DevToolsAccount">
      <div className="DevToolsAccount-Wrapper">
        <List>{list}</List>
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
              <input
                type="address"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['address']}
              />
              <br />
              Label:{' '}
              <input
                type="label"
                name="label"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['label']}
              />
              <br />
              Network:{' '}
              <input
                type="network"
                name="network"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['network']}
              />
              <br />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
