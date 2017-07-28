// @flow
import React, { Component } from 'react';

type Props = {
  togglePassword: Function,
  isPasswordVisible: ?boolean,
  input: Object,
  meta: Object
};

export default class PasswordInput extends Component {
  props: Props;

  render() {
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
              placeholder="Do NOT forget to save this!"
              aria-label="Enter a strong password (at least 9 characters)"
            />
            <span
              onClick={togglePassword}
              aria-label="make password visible"
              role="button"
              className="input-group-addon eye"
            />
          </div>
        </div>
      </div>
    );
  }
}
