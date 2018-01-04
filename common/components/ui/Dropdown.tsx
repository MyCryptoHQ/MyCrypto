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
  onChange?(value: T): void;
}

interface State {
  search: string;
}

export default class DropdownComponent<T> extends Component<Props<T>, State> {
  public state = {
    search: ''
  };

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
    const { search } = this.state;
    const searchable = options.length > 20;
    const menuClass = classnames({
      'dropdown-menu': true,
      [`dropdown-menu-${menuAlign || ''}`]: !!menuAlign
    });
    const searchableStyle = {
      maxHeight: '300px',
      overflowY: 'auto'
    };
    const searchRegex = new RegExp(search, 'gi');
    const onSearchChange = e => {
      this.setState({ search: e.target.value });
    };

    return (
      <ul className={menuClass} style={searchable ? searchableStyle : {}}>
        {searchable && (
          <input
            className="form-control"
            placeholder={'Search'}
            onChange={onSearchChange}
            value={search}
          />
        )}

        {options
          .filter(option => {
            if (searchable && search.length) {
              return option.toString().match(searchRegex);
            }
            return true;
          })
          .map((option, i) => {
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
    if (this.props.onChange) {
      this.props.onChange(value);
    }
    if (this.dropdownShell) {
      this.dropdownShell.close();
    }
  };
}
