import React, { Component } from 'react';
import Dropdown from './Dropdown';

interface Props {
  value: string | undefined;
  options: string[];
  ariaLabel?: string;
  onChange(value: string): void;
}

export default class SimpleDropdown extends Component<Props, void> {
  public render() {
    const { options, value, onChange, ariaLabel } = this.props;

    const StringDropdown = Dropdown as new () => Dropdown<string>;

    return (
      <StringDropdown
        options={options}
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel || 'dropdown'}
      />
    );
  }
}
