// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Identicon from 'components/ui/Identicon';
import { isValidETHAddress } from 'libs/validators';
import Input, { inputPropTypes } from './_Input';

export default class AddressInput extends React.Component {
  static propTypes = {
    ...inputPropTypes,
    showIdenticon: PropTypes.bool
  };

  static defaultProps = {
    placeholder: 'ensaddress.eth or 0x7a4bcg319...'
  };

  render() {
    const {
      name,
      placeholder,
      value,
      readonly,
      label,
      showIdenticon,
      onChange
    } = this.props;

    return (
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        readonly={readonly}
        label={label}
        validator={isValidETHAddress}
        onChange={onChange}
        postInput={showIdenticon && <Identicon address={value} />}
        rootClass="AddressInput"
      />
    );
  }
}
