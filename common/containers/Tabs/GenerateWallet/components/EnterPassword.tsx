import { GenerateNewWalletAction } from 'actions/generateWallet';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import translate from 'translations';
import { knowledgeBaseURL, MINIMUM_PASSWORD_LENGTH } from 'config/data';
import './EnterPassword.scss';
import PasswordInput from './PasswordInput';
import Template from './Template';

interface Props {
  generateNewWallet(pw: string): GenerateNewWalletAction;
}

interface State {
  fileName: null | string;
  blobURI: null | string;
  password: string;
  isPasswordValid: boolean;
  isPasswordVisible: boolean;
}
export default class EnterPassword extends Component<Props, State> {
  public state = {
    fileName: null,
    blobURI: null,
    password: '',
    isPasswordValid: false,
    isPasswordVisible: false
  };

  public render() {
    const { password, isPasswordValid, isPasswordVisible } = this.state;
    const content = (
      <div className="EnterPw">
        <h1 className="EnterPw-title" aria-live="polite">
          {translate('NAV_GenerateWallet')}
        </h1>

        <label className="EnterPw-password">
          <h4 className="EnterPw-password-label">{translate('GEN_Label_1')}</h4>
          <PasswordInput
            password={password}
            onPasswordChange={this.onPasswordChange}
            isPasswordVisible={isPasswordVisible}
            togglePassword={this.togglePassword}
            isPasswordValid={isPasswordValid}
          />
        </label>

        <button
          onClick={this.onClickGenerateFile}
          disabled={!isPasswordValid}
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
            <Link to="/send-transaction"> Ledger or TREZOR or Digital Bitbox</Link>
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
                href={`${knowledgeBaseURL}/getting-started/creating-a-new-wallet-on-myetherwallet`}
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
                href={`${knowledgeBaseURL}/getting-started/getting-started-new`}
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
    this.props.generateNewWallet(this.state.password);
    this.setState({ password: '' });
  };

  private togglePassword = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
  };

  private onPasswordChange = (e: any) => {
    const password = e.target.value;
    this.setState({
      isPasswordValid: password.length >= MINIMUM_PASSWORD_LENGTH,
      password
    });
  };
}
