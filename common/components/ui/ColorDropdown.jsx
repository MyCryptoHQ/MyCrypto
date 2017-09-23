// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import DropdownShell from './DropdownShell';

type Option = {
  name: string | React.Element<*>,
  value: any,
  color: string
};

type Props = {
  value: any,
  options: Option[],
  label?: string,
  ariaLabel: string,
  extra?: any,
  size?: string,
  color?: string,
  menuAlign?: string,
  onChange: (value: any) => void
};

export default class DropdownComponent extends Component {
  props: Props;
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
    const activeOption = options.find(opt => opt.value === value);
    const label = this.props.label ? `${this.props.label}:` : '';
    const menuClass = classnames({
      'dropdown-menu': true,
      [`dropdown-menu-${menuAlign || ''}`]: !!menuAlign
    });

    const listItems = options.reduce((prev, opt) => {
      const prevOpt = prev.length ? prev[prev.length - 1] : null;
      if (prevOpt && !prevOpt.divider && prevOpt.color !== opt.color) {
        prev.push({ divider: true });
      }
      prev.push(opt);
      return prev;
    }, []);

    return (
      <DropdownShell
        renderLabel={() =>
          <span>
            {label} {activeOption ? activeOption.name : '-'}
          </span>}
        renderOptions={() =>
          <ul className={menuClass}>
            {listItems.map((option, i) => {
              if (option.divider) {
                return <li key={i} role="separator" className="divider" />;
              } else {
                return (
                  <li
                    key={i}
                    style={{ borderLeft: `2px solid ${option.color}` }}
                  >
                    <a
                      className={option === value ? 'active' : ''}
                      onClick={this.onChange.bind(null, option)}
                    >
                      {option.name}
                    </a>
                  </li>
                );
              }
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

  onChange = (value: any) => {
    this.props.onChange(value);
    this.dropdownShell.close();
  };
}
