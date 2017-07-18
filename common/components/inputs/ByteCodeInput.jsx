// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { isValidHex } from 'libs/validators';
import Input, { inputPropTypes } from './_Input';

export default class ByteCodeInput extends React.Component {
  static propTypes = {
    ...inputPropTypes,
    isTextarea: PropTypes.bool
  };

  static defaultProps = {
    placeholder: '0x6d7965746865...',
    rows: 8
  };

  render() {
    const {
      name,
      placeholder,
      value,
      readonly,
      rows,
      label,
      isTextarea,
      onChange
    } = this.props;

    return (
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        readonly={readonly}
        rows={rows}
        label={label}
        type={isTextarea && 'textarea'}
        validator={isValidHex}
        onChange={onChange}
        rootClass="BCInput"
      />
    );
  }
}
