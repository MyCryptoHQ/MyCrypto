import React, { useContext } from 'react';
import { Formik, Field, Form, FieldProps, FormikProps } from 'formik';
import { Panel, Input } from '@mycrypto/ui';
import { Button, Link } from 'v2/components';
import styled from 'styled-components';

import { DEFAULT_NETWORK } from 'v2/config';
import { generateUUID } from 'v2/utils';
import {
  AccountContext,
  getLabelByAccount,
  AddressBookContext,
  DataContext
} from 'v2/services/Store';
import { useDevTools } from 'v2/services';
import { Account, AddressBook, WalletId, AssetBalanceObject, ExtendedAddressBook } from 'v2/types';

import ToolsNotifications from './ToolsNotifications';
import ToolsAccountList from './ToolsAccountList';

const DevToolsInput = styled(Input)`
  font-size: 1em;
`;

const renderAccountForm = (addressBook: ExtendedAddressBook[]) => ({
  values,
  handleChange,
  handleBlur,
  isSubmitting
}: FormikProps<Account>) => {
  const detectedLabel: AddressBook | undefined = getLabelByAccount(values, addressBook);
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
            <DevToolsInput {...field} onChange={handleChange} onBlur={handleBlur} value={label} />
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
              value={values.networkId}
            />
          )}
        />
      </fieldset>
      <br />
      Current dev-mode only features
      <ul>
        <li>Recent Transactions panel (Dashboard)</li>
        <li>Error page disabled</li>
      </ul>
      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </Form>
  );
};

const SLink = styled(Link)`
  font-weight: 600;
`;
const DBTools = () => {
  const { resetAppDb, addSeedData, removeSeedData } = useContext(DataContext);
  return (
    <div style={{ marginBottom: '1em' }}>
      {/*Reset Database*/}
      <p style={{ fontWeight: 600 }}>DB Tools</p>
      <div>
        You can choose to
        <SLink onClick={() => resetAppDb()}> Reset</SLink> the database to it's default values. or
        you can <SLink onClick={() => addSeedData()}>add seed accounts</SLink> to your existing DB,
        or revert the process by <SLink onClick={() => removeSeedData()}>removing</SLink> the dev
        accounts.
      </div>
    </div>
  );
};

const DevTools = () => {
  const { addressBook } = useContext(AddressBookContext);
  const { accounts, createAccountWithID, deleteAccount } = useContext(AccountContext);
  const dummyAccount = {
    label: 'Foo',
    address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    networkId: DEFAULT_NETWORK,
    assets: [
      {
        uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
        balance: '0',
        mtime: Date.now()
      }
    ] as AssetBalanceObject[],
    wallet: WalletId.METAMASK,
    mtime: Date.now(),
    transactions: [],
    uuid: '61d84f5e-0efa-46b9-915c-aed6ebe5a4dc',
    dPath: `m/44'/60'/0'/0/0`,
    favorite: false
  };

  return (
    <React.Fragment>
      <Panel style={{ marginBottom: 0, paddingTop: 50 }}>
        {/* DB tools*/}
        <DBTools />
        {/* Dashboard notifications */}
        <ToolsNotifications />

        {/* Accounts list */}
        <ToolsAccountList accounts={accounts} deleteAccount={deleteAccount} />

        {/* Form */}
        <div className="Settings-heading">Enter a new Account</div>
        <Formik
          initialValues={dummyAccount}
          onSubmit={(values: Account, { setSubmitting }) => {
            createAccountWithID(values, generateUUID());
            setSubmitting(false);
          }}
        >
          {renderAccountForm(addressBook)}
        </Formik>
      </Panel>
    </React.Fragment>
  );
};

const DevToolsToggle = () => {
  const { isActive, toggleDevTools } = useDevTools();
  return (
    <button
      onClick={toggleDevTools}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99,
        width: 112
      }}
    >
      {isActive ? 'DevMode On' : 'DevMode Off'}
    </button>
  );
};

const DevToolsManager = () => {
  const { isActive } = useDevTools();
  return (
    <div>
      <DevToolsToggle />
      {isActive && (
        <div style={{ width: '400px' }}>
          <DevTools />
        </div>
      )}
    </div>
  );
};

export { DevToolsManager };
