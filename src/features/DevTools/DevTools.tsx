import React, { useContext } from 'react';
import { Formik, Field, Form, FieldProps, FormikProps } from 'formik';
import { Panel, Input } from '@mycrypto/ui';
import { Button, Link, Checkbox } from '@components';
import styled from 'styled-components';

import { DEFAULT_NETWORK, IIS_ACTIVE_FEATURE } from '@config';
import { generateUUID, IS_DEV } from '@utils';
import {
  AccountContext,
  getLabelByAddressAndNetwork,
  AddressBookContext,
  DataContext,
  NetworkContext
} from '@services/Store';
import { useDevTools, useFeatureFlags } from '@services';
import {
  TAddress,
  IRawAccount,
  AddressBook,
  WalletId,
  AssetBalanceObject,
  ExtendedAddressBook,
  Network
} from '@types';
import { BREAK_POINTS } from '@theme';

import ToolsNotifications from './ToolsNotifications';
import ToolsAccountList from './ToolsAccountList';
import { ErrorContext } from '../ErrorHandling';

const DevToolsInput = styled(Input)`
  font-size: 1em;
`;

const renderAccountForm = (
  addressBook: ExtendedAddressBook[],
  getNetworkById: (name: string) => Network | undefined
) => ({ values, handleChange, handleBlur, isSubmitting }: FormikProps<IRawAccount>) => {
  const detectedLabel: AddressBook | undefined = getLabelByAddressAndNetwork(
    values.address,
    addressBook,
    getNetworkById(values.networkId)
  );
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

const ErrorTools = () => {
  const { suppressErrors, toggleSuppressErrors } = useContext(ErrorContext);
  return (
    <div style={{ marginBottom: '1em' }}>
      <p style={{ fontWeight: 600 }}>Error Tools</p>
      <Checkbox
        name={'suppress_errors'}
        label={'Suppress Errors'}
        checked={suppressErrors}
        onChange={() => toggleSuppressErrors()}
      />
    </div>
  );
};

const FeatureFlags = () => {
  const { IS_ACTIVE_FEATURE, setFeatureFlag } = useFeatureFlags();
  return (
    <>
      {' '}
      {Object.entries(IS_ACTIVE_FEATURE).map((f) => (
        <Checkbox
          key={f[0]}
          name={f[0]}
          label={f[0]}
          checked={f[1]}
          onChange={() => setFeatureFlag(f[0] as keyof IIS_ACTIVE_FEATURE, !f[1])}
        />
      ))}{' '}
    </>
  );
};

const DevTools = () => {
  const { getNetworkById } = useContext(NetworkContext);
  const { addressBook } = useContext(AddressBookContext);
  const { accounts, createAccountWithID, deleteAccount } = useContext(AccountContext);
  const dummyAccount = {
    label: 'Foo',
    address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d' as TAddress,
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
        <FeatureFlags />
        {/* DB tools*/}
        <DBTools />
        {/* Error handling tools */}
        <ErrorTools />

        {/* Dashboard notifications */}
        <ToolsNotifications />

        {/* Accounts list */}
        <ToolsAccountList accounts={accounts} deleteAccount={deleteAccount} />

        {/* Form */}
        <div className="Settings-heading">Enter a new Account</div>
        <Formik
          initialValues={dummyAccount}
          onSubmit={(values: IRawAccount, { setSubmitting }) => {
            createAccountWithID(values, generateUUID());
            setSubmitting(false);
          }}
        >
          {renderAccountForm(addressBook, getNetworkById)}
        </Formik>
      </Panel>
    </React.Fragment>
  );
};

const DevToolsManagerContainer = styled.div<{ isActive: boolean }>`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  max-width: 450px;
  height: 100vh;

  ${({ isActive }) =>
    isActive &&
    `
  overflow-y: scroll;
`}

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: fixed;
    z-index: 100;
    max-width: 100vw;
  }
`;

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
    <DevToolsManagerContainer isActive={isActive}>
      {IS_DEV ? (
        <div>
          <DevToolsToggle />
          {isActive && (
            <div style={{ width: '400px' }}>
              <DevTools />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </DevToolsManagerContainer>
  );
};

export { DevToolsManager };
