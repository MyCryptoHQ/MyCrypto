// @flow
import React, { Component } from 'react';
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

type Props = {
  walletPasswordForm: Object,
  showWalletPassword: Function,
  generateNewWallet: Function
};

class EnterPassword extends Component {
  props: Props;

  state = {
    fileName: null,
    blobURI: null,
    isPasswordVisible: false
  };

  _onClickGenerateFile = () => {
    const form = this.props.walletPasswordForm;
    this.props.generateNewWallet(form.values.password);
  };

  _togglePassword = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
  };

  render() {
    const { walletPasswordForm } = this.props;
    const { isPasswordVisible } = this.state;

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
            isPasswordVisible={isPasswordVisible}
            togglePassword={this._togglePassword}
            name="password"
            type="text"
          />
          <br />
          <button
            onClick={this._onClickGenerateFile}
            disabled={walletPasswordForm ? walletPasswordForm.syncErrors : true}
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
  form: 'walletPasswordForm' // a unique name for this form
})(EnterPassword);
