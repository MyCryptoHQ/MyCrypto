import React, { Component } from 'react';
import translate from 'translations';
import { MINIMUM_PASSWORD_LENGTH } from 'config/data';
import './EnterPassword.scss';
import PasswordInput from './PasswordInput';
import Template from '../Template';

interface Props {
  continue(pw: string): void;
}

interface State {
  password: string;
  isPasswordValid: boolean;
  isPasswordVisible: boolean;
}
export default class EnterPassword extends Component<Props, State> {
  public state = {
    password: '',
    isPasswordValid: false,
    isPasswordVisible: false
  };

  public render() {
    const { password, isPasswordValid, isPasswordVisible } = this.state;

    return (
      <Template>
        <div className="EnterPw">
          <h1 className="EnterPw-title" aria-live="polite">
            Generate a {translate('x_Keystore2')}
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
      </Template>
    );
  }
  private onClickGenerateFile = () => {
    this.props.continue(this.state.password);
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
