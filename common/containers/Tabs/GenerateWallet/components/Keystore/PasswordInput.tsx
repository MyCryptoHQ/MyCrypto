import React, { Component } from 'react';
import { translateRaw } from 'translations';

interface Props {
  password: string;
  onPasswordChange: any;
  togglePassword: any;
  isPasswordVisible?: boolean;
  isPasswordValid: boolean;
}

export default class PasswordInput extends Component<Props, {}> {
  public render() {
    const {
      password,
      isPasswordValid,
      isPasswordVisible,
      togglePassword,
      onPasswordChange
    } = this.props;

    return (
      <div>
        <div>
          <div className="input-group" style={{ width: '100%' }}>
            <input
              value={password}
              name="password"
              className={`form-control ${!isPasswordValid ? 'is-invalid' : ''}`}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder={translateRaw('GEN_Placeholder_1')}
              aria-label={translateRaw('GEN_Aria_1')}
              onChange={onPasswordChange}
            />
            <span
              onClick={togglePassword}
              aria-label={translateRaw('GEN_Aria_2')}
              role="button"
              className="input-group-addon eye"
            />
          </div>
        </div>
      </div>
    );
  }
}
