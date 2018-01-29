import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { MINIMUM_PASSWORD_LENGTH } from 'config';
import { TogglablePassword } from 'components';
import Template from '../Template';
import './EnterPassword.scss';

interface Props {
  continue(pw: string): void;
}

interface State {
  password: string;
  isPasswordValid: boolean;
}
export default class EnterPassword extends Component<Props, State> {
  public state = {
    password: '',
    isPasswordValid: false
  };

  public render() {
    const { password, isPasswordValid } = this.state;

    return (
      <Template>
        <div className="EnterPw">
          <h1 className="EnterPw-title" aria-live="polite">
            Generate a {translate('x_Keystore2')}
          </h1>

          <label className="EnterPw-password">
            <h4 className="EnterPw-password-label">{translate('GEN_Label_1')}</h4>
            <TogglablePassword
              value={password}
              placeholder={translateRaw('GEN_Placeholder_1')}
              ariaLabel={translateRaw('GEN_Aria_1')}
              toggleAriaLabel={translateRaw('GEN_Aria_2')}
              isValid={isPasswordValid}
              onChange={this.onPasswordChange}
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

  private onPasswordChange = (e: any) => {
    const password = e.target.value;
    this.setState({
      isPasswordValid: password.length >= MINIMUM_PASSWORD_LENGTH,
      password
    });
  };
}
