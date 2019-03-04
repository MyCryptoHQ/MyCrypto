import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';

import { AccountContext } from 'v2/providers';
import './DevTools.scss';

interface State {
  editing: string | null;
}

export default class DevTools extends Component {
  public state: State = {
    editing: null
  };

  public render() {
    const { editing } = this.state;

    return (
      <AccountContext.Consumer>
        {({ accountHash, allAccounts, createAccount, updateAccount, deleteAccount }) => (
          <div className="DevTools">
            <ul>
              {allAccounts.map(uuid => (
                <li key={uuid}>
                  <span>
                    {accountHash[uuid].label} <button onClick={() => deleteAccount(uuid)}>x</button>
                    <button onClick={() => this.startEditing(uuid)}>e</button>
                  </span>
                </li>
              ))}
            </ul>
            {editing && (
              <Formik
                validationSchema={{
                  label: Yup().string().min(1, '').max(256, '').required('')
                }}
                initialValues={{
                  label: accountHash[editing].label,
                  address: accountHash[editing].address,
                  network: accountHash[editing].network,
                  accountType: accountHash[editing].accountType
                }}
                onSubmit={accountConfig => {
                  updateAccount(editing, accountConfig);
                  this.stopEditing();
                }}
                render={({ dirty, errors, touched }) => (
                  <Form>
                    <label>Editing Account "{accountHash[editing].label}"</label>
                    <fieldset>
                      <label htmlFor="label">Label</label>
                      <Field name="label" type="text" />
                      {touched.label && errors.label && <div>{errors.label}</div>}
                    </fieldset>
                    <fieldset>
                      <label htmlFor="address">Address</label>
                      <Field name="address" type="text" />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="network">Network</label>
                      <Field name="network" type="text" />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="accountType">Type</label>
                      <Field name="accountType" type="text" />
                    </fieldset>
                    <fieldset>
                      <button type="button" onClick={this.stopEditing}>
                        Stop editing
                      </button>
                      {dirty && <button type="reset">Undo changes</button>}
                      <button disabled={!dirty}>Update Account</button>
                    </fieldset>
                  </Form>
                )}
              />
            )}
            <div>
              <label>Add Account</label>
              <Formik
                initialValues={{
                  label: '',
                  address: '',
                  network: '',
                  accountType: ''
                }}
                onSubmit={(accountConfig, { resetForm }) => {
                  createAccount(accountConfig);
                  resetForm();
                }}
                render={() => (
                  <Form>
                    <fieldset>
                      <label htmlFor="label">Label</label>
                      <Field name="label" type="text" />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="address">Address</label>
                      <Field name="address" type="text" />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="network">Network</label>
                      <Field name="network" type="text" />
                    </fieldset>
                    <fieldset>
                      <label htmlFor="accountType">Type</label>
                      <Field name="accountType" type="text" />
                    </fieldset>
                    <fieldset>
                      <button>Add Account</button>
                    </fieldset>
                  </Form>
                )}
              />
            </div>
          </div>
        )}
      </AccountContext.Consumer>
    );
  }

  private startEditing = (uuid: string) =>
    this.setState({
      editing: uuid
    });

  private stopEditing = () =>
    this.setState({
      editing: null
    });
}
