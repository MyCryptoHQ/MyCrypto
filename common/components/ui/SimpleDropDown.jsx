// @flow
import React, { Component } from 'react';
import Dropdown from './Dropdown';

type Props = {
  value?: string,
  options: string[],
  onChange: (value: string) => void
};

export default class SimpleDropDown extends Component {
  props: Props;

  render() {
    const { options, value } = this.props;

    return (
      <Dropdown
        options={options}
        value={value}
        onChange={this.onChange}
        ariaLabel="dropdown"
      />
    );
  }

  onChange(value: any) {
    // Flow doesn't believe us that the value is going to be a string otherwise
    this.props.onChange(value.toString());
  }
}
