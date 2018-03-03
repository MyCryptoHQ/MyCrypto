import React, { Component } from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';
import translate, { translateRaw } from 'translations';
import { MINIMUM_PASSWORD_LENGTH } from 'config';
import { Spinner } from 'components/ui';
import Template from '../Template';
import './EnterPassword.scss';
import { TogglablePassword } from 'components';

interface Props {
  isGenerating: boolean;
  continue(pw: string): void;
}

interface State {
  password: string;
  confirmedPassword: string;
  passwordValidation: ZXCVBNResult | null;
  feedback: string;
}
export default class EnterPassword extends Component<Props, State> {
  public state: State = {
    password: '',
    confirmedPassword: '',
    passwordValidation: null,
    feedback: ''
  };

  public render() {
    const { isGenerating } = this.props;
    const { password, confirmedPassword, feedback } = this.state;
    const passwordValidity = this.getPasswordValidity();
    const isPasswordValid = passwordValidity === 'valid';
    const isConfirmValid = confirmedPassword ? password === confirmedPassword : undefined;
    const canSubmit = isPasswordValid && isConfirmValid && !isGenerating;

    return (
      <Template>
        <form className="EnterPw" onSubmit={canSubmit ? this.handleSubmit : undefined}>
          <h1 className="EnterPw-title" aria-live="polite">
            Generate a {translate('x_Keystore2')}
          </h1>

          <div className="input-group-wrapper EnterPw-password">
            <label className="input-group">
              <div className="input-group-header">{translate('GEN_Label_1')}</div>
              <TogglablePassword
                className={!isPasswordValid && password.length > 0 ? 'invalid' : ''}
                value={password}
                placeholder={`Password must be uncommon and ${MINIMUM_PASSWORD_LENGTH}+ characters long`}
                onChange={this.onPasswordChange}
                onBlur={this.showFeedback}
              />
              {!isPasswordValid &&
                feedback && (
                  <p className={`EnterPw-password-feedback help-block is-${passwordValidity}`}>
                    {feedback}
                  </p>
                )}
            </label>
          </div>

          <div className="input-group-wrapper EnterPw-password">
            <label className="input-group">
              <div className="input-group-header">Confirm password</div>
              <TogglablePassword
                className={!isConfirmValid && password.length > 0 ? 'invalid' : ''}
                value={confirmedPassword}
                placeholder={translateRaw('GEN_Placeholder_1')}
                onChange={this.onConfirmChange}
              />
            </label>
          </div>

          <button disabled={!canSubmit} className="EnterPw-submit btn btn-primary btn-lg btn-block">
            {isGenerating ? <Spinner light={true} /> : translate('NAV_GenerateWallet')}
          </button>

          <p className="EnterPw-warning">{translate('x_PasswordDesc')}</p>
        </form>
      </Template>
    );
  }

  private getPasswordValidity(): 'valid' | 'invalid' | 'semivalid' | undefined {
    const { password, passwordValidation } = this.state;

    if (!password) {
      return undefined;
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      return 'invalid';
    }

    if (passwordValidation && passwordValidation.score < 3) {
      return 'semivalid';
    }

    return 'valid';
  }

  private getFeedback() {
    let feedback = '';
    const validity = this.getPasswordValidity();

    if (validity !== 'valid') {
      const { password, passwordValidation } = this.state;

      if (password.length < MINIMUM_PASSWORD_LENGTH) {
        feedback = `Password must be ${MINIMUM_PASSWORD_LENGTH}+ characters`;
      } else if (passwordValidation && passwordValidation.feedback) {
        feedback = `This password is not strong enough. ${passwordValidation.feedback.warning}.`;
      } else {
        feedback = 'There is something invalid about your password. Please try another.';
      }
    }

    return feedback;
  }

  private handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    this.props.continue(this.state.password);
  };

  private onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    const passwordValidation = password ? zxcvbn(password) : null;

    this.setState(
      {
        password,
        passwordValidation,
        feedback: ''
      },
      () => {
        if (password.length >= MINIMUM_PASSWORD_LENGTH) {
          this.showFeedback();
        }
      }
    );
  };

  private onConfirmChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ confirmedPassword: e.currentTarget.value });
  };

  private showFeedback = () => {
    const { password, passwordValidation } = this.state;
    if (!password) {
      return;
    }

    const feedback = this.getFeedback();
    this.setState({ passwordValidation, feedback });
  };
}
