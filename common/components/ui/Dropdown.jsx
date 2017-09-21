// @flow
import React, { Component } from 'react';
import DropdownShell from './DropdownShell';

type Props<T> = {
  value: T,
  options: T[],
  label?: string,
  ariaLabel: string,
  extra?: any,
  size?: string,
  color?: string,
  formatTitle?: (option: T) => any,
  onChange: (value: T) => void
};

export default class DropdownComponent<T: *> extends Component<
  void,
  Props<T>,
  void
> {
  props: Props<T>;
  dropdownShell: DropdownShell;

  render() {
    const { options, value, ariaLabel, color, size, extra } = this.props;
    const label = this.props.label ? `${this.props.label}:` : '';

    return (
      <DropdownShell
        renderLabel={() =>
          <span>
            {label} {this.formatTitle(value)}
          </span>}
        renderOptions={() =>
          <ul className="dropdown-menu">
            {options.map((option, i) => {
              return (
                <li key={i}>
                  <a
                    className={option === value ? 'active' : ''}
                    onClick={this.onChange.bind(null, option)}
                  >
                    {this.formatTitle(option)}
                  </a>
                </li>
              );
            })}
            {extra}
          </ul>}
        size={size}
        color={color}
        ariaLabel={ariaLabel}
        ref={el => (this.dropdownShell = el)}
      />
    );
  }

  formatTitle(option: any) {
    if (this.props.formatTitle) {
      return this.props.formatTitle(option);
    } else {
      return option;
    }
  }

  onChange = (value: any) => {
    this.props.onChange(value);
    this.dropdownShell.close();
  };
}
