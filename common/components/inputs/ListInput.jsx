// @flow
import React from 'react';
import Input, { inputPropTypes } from './_Input';

export default class ByteCodeInput extends React.Component {
  static propTypes = inputPropTypes;

  static defaultProps = {
    placeholder: 'Select an option...'
  };

  render() {
    const {
      name,
      placeholder,
      value,
      options,
      readonly,
      label,
      onChange
    } = this.props;

    // Placeholder is first option with value of null
    const allOptions = placeholder
      ? [{ label: placeholder, value: null }, ...options]
      : options;

    return (
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        options={allOptions}
        readonly={readonly}
        label={label}
        type={'select'}
        onChange={onChange}
        rootClass="ListInput"
      />
    );
  }
}
