import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GenerateWalletPasswordInputComponent extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    generateWalletShowPassword: PropTypes.func,
    showPassword: PropTypes.bool,
    input: PropTypes.object,
    meta: PropTypes.object
  };

  render() {
    return (
      <div>
        <div>
          <div className="input-group" style={{ width: '100%' }}>
            <input
              {...this.props.input}
              name="password"
              className={
                this.props.meta.error
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              type={this.props.showPassword ? 'text' : 'password'}
              placeholder="Do NOT forget to save this!"
              aria-label="Enter a strong password (at least 9 characters)"
            />
            <span
              onClick={() => this.props.generateWalletShowPassword()}
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
