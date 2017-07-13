import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import translate from 'translations';
import PasswordInput from './PasswordInput';
import LedgerTrezorWarning from './LedgerTrezorWarning';

// VALIDATORS
const minLength = min => value => {
  return value && value.length < min
    ? `Must be ${min} characters or more`
    : undefined;
};
const minLength9 = minLength(9);
const required = value => (value ? undefined : 'Required');

class EnterPassword extends Component {
  static propTypes = {
    // state
    generateWalletPassword: PropTypes.object,
    showPassword: PropTypes.bool,
    // actions
    showPasswordGenerateWallet: PropTypes.func,
    generateFileGenerateWallet: PropTypes.func
  };

  render() {
    const {
      generateWalletPassword,
      showPassword,
      showPasswordGenerateWallet,
      generateFileGenerateWallet
    } = this.props;

    return (
      <div>
        <section className="row">
          <h1 aria-live="polite">
            {translate('NAV_GenerateWallet')}
          </h1>
          <div className="col-sm-8 col-sm-offset-2">
            <h4>
              {translate('HELP_1_Desc_3')}
            </h4>
            <Field
              validate={[required, minLength9]}
              component={PasswordInput}
              showPassword={showPassword}
              showPasswordGenerateWallet={showPasswordGenerateWallet}
              name="password"
              type="text"
            />
            <br />
            <button
              onClick={() => generateFileGenerateWallet()}
              disabled={
                generateWalletPassword
                  ? generateWalletPassword.syncErrors
                  : true
              }
              className="btn btn-primary btn-block"
            >
              {translate('NAV_GenerateWallet')}
            </button>
          </div>
        </section>
        <LedgerTrezorWarning />
      </div>
    );
  }
}

export default reduxForm({
  form: 'generateWalletPassword' // a unique name for this form
})(EnterPassword);
