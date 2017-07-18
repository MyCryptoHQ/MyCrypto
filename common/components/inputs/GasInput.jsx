// @flow
import React from 'react';
import Input, { inputPropTypes } from './_Input';

export default class ByteCodeInput extends React.Component {
  static propTypes = inputPropTypes;

  static defaultProps = {
    placeholder: '30000'
  };

  _validateGas(value) {
    // Casts strings to int, but unlike parseInt, won't deal with grabage like
    // "20gwei", only pure raw numbers.
    return !~~value;
  }

  render() {
    const { name, placeholder, value, readonly, label, onChange } = this.props;
    return (
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        readonly={readonly}
        label={label}
        type={'number'}
        validator={this._validateGas}
        onChange={onChange}
        rootClass="BCInput"
      />
    );
  }
}
