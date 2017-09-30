// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import DropdownShell from './DropdownShell';

interface Option<T> {
  name: any;
  value: T;
  color?: string;
}

interface Props<T> {
  value: T;
  options: Option<T>[];
  label?: string;
  ariaLabel: string;
  extra?: any;
  size?: string;
  color?: string;
  menuAlign?: string;
  onChange(value: T): void;
}

export default class ColorDropdown<T> extends Component<Props<T>, {}> {
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
    const label = this.props.label ? `${this.props.label}:` : '';
    const activeOption = this.getActiveOption();

    return (
      <span>
        {label} {activeOption ? activeOption.name : '-'}
      </span>
    );
  };

  private renderOptions = () => {
    const { options, value, menuAlign, extra } = this.props;

    const activeOption = this.getActiveOption();

    const listItems = options.reduce((prev: any[], opt) => {
      const prevOpt = prev.length ? prev[prev.length - 1] : null;
      if (prevOpt && !prevOpt.divider && prevOpt.color !== opt.color) {
        prev.push({ divider: true });
      }
      prev.push(opt);
      return prev;
    }, []);

    const menuClass = classnames({
      'dropdown-menu': true,
      [`dropdown-menu-${menuAlign || ''}`]: !!menuAlign
    });

    return (
      <ul className={menuClass}>
        {listItems.map((option, i) => {
          if (option.divider) {
            return <li key={i} role="separator" className="divider" />;
          } else {
            return (
              <li key={i} style={{ borderLeft: `2px solid ${option.color}` }}>
                <a
                  className={option.value === value ? 'active' : ''}
                  onClick={this.onChange.bind(null, option.value)}
                >
                  {option.name}
                </a>
              </li>
            );
          }
        })}
        {extra && <li key="separator" role="separator" className="divider" />}
        {extra}
      </ul>
    );
  };

  private onChange = (value: any) => {
    this.props.onChange(value);
    if (this.dropdownShell) {
      this.dropdownShell.close();
    }
  };

  private getActiveOption() {
    return this.props.options.find(opt => opt.value === this.props.value);
  }
}
