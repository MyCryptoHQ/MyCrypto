import { GenerateNewWalletAction } from 'actions/generateWallet';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import translate from 'translations';
import './EnterPassword.scss';
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

interface Props {
  walletPasswordForm: any;
  generateNewWallet(pw: string): GenerateNewWalletAction;
}

interface State {
  fileName: null | string;
  blobURI: null | string;
  isPasswordVisible: boolean;
}
class EnterPassword extends Component<Props, State> {
  public state = {
    fileName: null,
    blobURI: null,
    isPasswordVisible: false
  };

  public render() {
    const { walletPasswordForm } = this.props;
    const { isPasswordVisible } = this.state;
    const AnyField = Field as new () => Field<any>;
    const content = (
      <div className="EnterPw">
        <h1 className="EnterPw-title" aria-live="polite">
          {translate('NAV_GenerateWallet')}
        </h1>

        <label className="EnterPw-password">
          <h4 className="EnterPw-password-label">{translate('GEN_Label_1')}</h4>
          <AnyField
            className="EnterPw-password-field"
            validate={[required, minLength9]}
            component={PasswordInput}
            isPasswordVisible={isPasswordVisible}
            togglePassword={this.togglePassword}
            name="password"
            type="text"
          />
        </label>

        <button
          onClick={this.onClickGenerateFile}
          disabled={walletPasswordForm ? walletPasswordForm.syncErrors : true}
          className="EnterPw-submit btn btn-primary btn-block"
        >
          {translate('NAV_GenerateWallet')}
        </button>

        <p className="EnterPw-warning">{translate('x_PasswordDesc')}</p>
      </div>
    );

    const help = (
      <div>
        <h4>Ledger / TREZOR:</h4>
        <ul>
          <li>
            <span>{translate('GEN_Help_1')}</span>
            <Link to="/send-transaction">
              {' '}
              Ledger or TREZOR or Digital Bitbox
            </Link>
            <span> {translate('GEN_Help_2')}</span>
            <span> {translate('GEN_Help_3')}</span>
          </li>
        </ul>

        <h4>Jaxx / Metamask:</h4>
        <ul>
          <li>
            <span>{translate('GEN_Help_1')}</span>
            <Link to="/send-transaction"> {translate('x_Mnemonic')}</Link>
            <span> {translate('GEN_Help_2')}</span>
          </li>
        </ul>

        <h4>Mist / Geth / Parity:</h4>
        <ul>
          <li>
            <span>{translate('GEN_Help_1')}</span>
            <Link to="/send-transaction"> {translate('x_Keystore2')}</Link>
            <span> {translate('GEN_Help_2')}</span>
          </li>
        </ul>

        <h4>Guides & FAQ</h4>
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
  private onClickGenerateFile = () => {
    const form = this.props.walletPasswordForm;
    this.props.generateNewWallet(form.values.password);
  };

  private togglePassword = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
  };
}

export default reduxForm({
  form: 'walletPasswordForm' // a unique name for this form
})(EnterPassword as any);
