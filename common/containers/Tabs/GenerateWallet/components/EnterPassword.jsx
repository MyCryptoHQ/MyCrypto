import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import translate from 'translations';
import { genNewKeystore } from 'libs/keystore';
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

  genNewKeystoreAndSetState = (password: string) => {
    const { fileName, blobURI } = genNewKeystore(password);
    this.setState({
      fileName: fileName,
      blobURI: blobURI
    });
  };

  onClickGenerateFile = () => {
    this.genNewKeystoreAndSetState(
      this.props.generateWalletPassword.values.password
    );
    this.props.generateFileGenerateWallet();
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

          <br />
          <br />
          <br />
          <p className="strong">
            Ledger &amp; TREZOR users: Do not generate a new wallet—your
            hardware device <em> is </em> your wallet.<br />
            <a>
              You can connect to your device, see your addresses, or send ETH or
              Tokens here.
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'generateWalletPassword' // a unique name for this form
})(EnterPassword);
