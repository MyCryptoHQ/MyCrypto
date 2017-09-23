// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import DropdownShell from './DropdownShell';

type Props<T> = {
  value: T,
  options: T[],
  label?: string,
  ariaLabel: string,
  extra?: any,
  size?: string,
  color?: string,
  menuAlign?: string,
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
    const {
      options,
      value,
      ariaLabel,
      color,
      size,
      extra,
      menuAlign
    } = this.props;
    const label = this.props.label ? `${this.props.label}:` : '';
    const menuClass = classnames({
      'dropdown-menu': true,
      [`dropdown-menu-${menuAlign || ''}`]: !!menuAlign
    });

    return (
      <DropdownShell
        renderLabel={() =>
          <span>
            {label} {this.formatTitle(value)}
          </span>}
        renderOptions={() =>
          <ul className={menuClass}>
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
            {extra &&
              <li key={'separator'} role="separator" className="divider" />}
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
