import React, { Component } from 'react';
import { Formik, Field, Form } from 'formik';
import { List, Address, Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import AccountServiceBase from 'v2/services/Account/Account';
import { account, extendedAccount } from 'v2/services/Account';
import { truncate } from 'v2/libs';

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

const Account = new AccountServiceBase();

export default class DevTools extends Component {
  constructor(props: any) {
    super(props);
    Account.init();
    const accounts: extendedAccount[] = Account.readAccounts() || [];
    this.state = {
      accounts: accounts
    };
  }
  getAccounts = () => {
    const accounts: extendedAccount[] = Account.readAccounts() || [];
    this.setState({ accounts: accounts });
  };

  handleSubmit = () => {
    this.getAccounts();
  };

  handleDelete = (uuid: string) => {
    Account.deleteAccount(uuid);
    this.getAccounts();
  };

  render() {
    const { accounts } = this.state;
    const list = accounts.map((account: extendedAccount) => {
      return (
        <AccountContainer>
          <Address title={account.label} address={account.address} truncate={truncate} />
          <DeleteButton onClick={() => this.handleDelete(account.uuid)} icon="exit" />
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
              this.handleSubmit();
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
  }
}
