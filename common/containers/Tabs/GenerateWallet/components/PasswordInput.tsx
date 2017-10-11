import React, { Component } from 'react';
import { translateRaw } from 'translations';

interface Props {
  togglePassword: any;
  isPasswordVisible?: boolean;
  input: any;
  meta: any;
}

export default class PasswordInput extends Component<Props, {}> {
  public render() {
    const { input, meta, isPasswordVisible, togglePassword } = this.props;

    return (
      <div>
        <div>
          <div className="input-group" style={{ width: '100%' }}>
            <input
              {...input}
              name="password"
              className={`form-control ${meta.error ? 'is-invalid' : ''}`}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder={translateRaw('GEN_Placeholder_1')}
              aria-label={translateRaw('GEN_Aria_1')}
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
