// @flow
import React from 'react';
import { isValidABIJson } from 'libs/validators';
import Input, { inputPropTypes } from './_Input';

export default class ABIInput extends React.Component {
  static propTypes = inputPropTypes;

  static defaultProps = {
    placeholder: '[{ "type": "constructor", ... }]',
    rows: 6
  };

  render() {
    const {
      name,
      placeholder,
      value,
      readonly,
      label,
      rows,
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
        validator={isValidABIJson}
        onChange={onChange}
        type="textarea"
        rootClass="ABIInput"
      />
    );
  }
}
