// @flow
import './EnterPassword.scss';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import translate from 'translations';
import PasswordInput from './PasswordInput';
import Template from './Template';

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

    const content = (
      <div className="EnterPw">
        <h1 className="EnterPw-title" aria-live="polite">
          {translate('NAV_GenerateWallet')}
        </h1>

        <label className="EnterPw-password">
          <h4 className="EnterPw-password-label">
            {translate('GEN_Label_1')}
          </h4>
          <Field
            className="EnterPw-password-field"
            validate={[required, minLength9]}
            component={PasswordInput}
            isPasswordVisible={isPasswordVisible}
            togglePassword={this._togglePassword}
            name="password"
            type="text"
          />
        </label>

        <button
          onClick={this._onClickGenerateFile}
          disabled={walletPasswordForm ? walletPasswordForm.syncErrors : true}
          className="EnterPw-submit btn btn-primary btn-block"
        >
          {translate('NAV_GenerateWallet')}
        </button>

        <p className="EnterPw-warning">
          {translate('x_PasswordDesc')}
        </p>
      </div>
    );

    const help = (
      <div>
        <h4>Ledger / TREZOR:</h4>
        <ul>
          <li>
            <span>
              {translate('GEN_Help_1')}
            </span>
            <Link to="/send-transaction">
              {' '}Ledger or TREZOR or Digital Bitbox
            </Link>
            <span>
              {' '}{translate('GEN_Help_2')}
            </span>
            <span translate="GEN_Help_3" className="ng-scope">
              {' '}{translate('GEN_Help_3')}
            </span>
          </li>
        </ul>

        <h4>Jaxx / Metamask:</h4>
        <ul>
          <li>
            <span>
              {translate('GEN_Help_1')}
            </span>
            <Link to="/send-transaction">
              {' '}{translate('x_Mnemonic')}
            </Link>
            <span>
              {' '}{translate('GEN_Help_2')}
            </span>
          </li>
        </ul>

        <h4>Mist / Geth / Parity:</h4>
        <ul>
          <li>
            <span>
              {translate('GEN_Help_1')}
            </span>
            <Link to="/send-transaction">
              {' '}{translate('x_Keystore2')}
            </Link>
            <span>
              {' '}{translate('GEN_Help_2')}
            </span>
          </li>
        </ul>

        <h4 translate="GEN_Help_4" className="ng-scope">
          Guides & FAQ
        </h4>
        <ul>
          <li>
            <strong>
              <a
                href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-create-a-new-wallet"
                target="_blank"
                rel="noopener"
              >
                {translate('GEN_Help_5')}
              </a>
            </strong>
          </li>
          <li>
            <strong>
              <a
                href="https://myetherwallet.groovehq.com/knowledge_base/categories/getting-started-443"
                target="_blank"
                rel="noopener"
              >
                {translate('GEN_Help_6')}
              </a>
            </strong>
          </li>
        </ul>
      </div>
    );

    return <Template content={content} help={help} />;
  }
}

export default reduxForm({
  form: 'walletPasswordForm' // a unique name for this form
})(EnterPassword);
