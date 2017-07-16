// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import translate from 'translations';
import PasswordInput from './PasswordInput';

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
    // Store state
    generateWalletPassword: PropTypes.object,
    showPassword: PropTypes.bool,
    // Actions
    showPasswordGenerateWallet: PropTypes.func,
    generateUTCGenerateWallet: PropTypes.func
  };

  state = {
    fileName: null,
    blobURI: null
  };

  onClickGenerateFile = () => {
    const form = this.props.generateWalletPassword;
    this.props.generateUTCGenerateWallet(form.values.password);
  };

  render() {
    const {
      generateWalletPassword,
      showPassword,
      showPasswordGenerateWallet
    } = this.props;

    return (
      <div>
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
            onClick={this.onClickGenerateFile}
            disabled={
              generateWalletPassword ? generateWalletPassword.syncErrors : true
            }
            className="btn btn-primary btn-block"
          >
            {translate('NAV_GenerateWallet')}
          </button>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'generateWalletPassword' // a unique name for this form
})(EnterPassword);
