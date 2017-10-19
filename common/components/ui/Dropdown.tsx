import React, { Component } from 'react';
import classnames from 'classnames';
import DropdownShell from './DropdownShell';

interface Props<T> {
  value: T | undefined;
  options: T[];
  ariaLabel: string;
  label?: string;
  extra?: any;
  size?: string;
  color?: string;
  menuAlign?: string;
  formatTitle?(option: T): any;
  onChange(value: T): void;
}

export default class DropdownComponent<T> extends Component<Props<T>, {}> {
  private dropdownShell: DropdownShell | null;

  public render() {
    const { ariaLabel, color, size } = this.props;

    return (
      <DropdownShell
        renderLabel={this.renderLabel}
        renderOptions={this.renderOptions}
        size={size}
        color={color}
        ariaLabel={ariaLabel}
        ref={el => (this.dropdownShell = el)}
      />
    );
  }

  private renderLabel = () => {
    const { value } = this.props;
    const labelStr = this.props.label ? `${this.props.label}:` : '';
    return (
      <span>
        {labelStr} {this.formatTitle(value)}
      </span>
    );
  };

  private renderOptions = () => {
    const { options, value, menuAlign, extra } = this.props;
    const menuClass = classnames({
      'dropdown-menu': true,
      [`dropdown-menu-${menuAlign || ''}`]: !!menuAlign
    });

    return (
      <ul className={menuClass}>
        {options.map((option, i) => {
          return (
            <li key={i}>
              <a
                className={option === value ? 'active' : ''}
                onClick={this.onChange.bind(null, option)}
              >
                {this.props.formatTitle ? this.formatTitle(option) : option}
              </a>
            </li>
          );
        })}
        {extra && <li key={'separator'} role="separator" className="divider" />}
        {extra}
      </ul>
    );
  };

  private formatTitle = (option: any) => {
    if (this.props.formatTitle) {
      return this.props.formatTitle(option);
    } else {
      return option;
    }
  };

  private onChange = (value: any) => {
    this.props.onChange(value);
    if (this.dropdownShell) {
      this.dropdownShell.close();
    }
  };
}
