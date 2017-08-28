// @flow
import React, { Component } from 'react';
import translate from 'translations';

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
              placeholder={translate('GEN_Placeholder_1', true)}
              aria-label={translate('GEN_Aria_1', true)}
            />
            <span
              onClick={togglePassword}
              aria-label={translate('GEN_Aria_2', true)}
              role="button"
              className="input-group-addon eye"
            />
          </div>
        </div>
      </div>
    );
  }
}
