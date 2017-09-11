// @flow
import React, { Component } from 'react';

type Props = {
  value: {},
  options: (?{})[],
  ariaLabel: string,
  formatTitle: (option: string) => any,
  extra?: any,
  onChange: (value: string) => void
};

type State = {
  expanded: boolean
};

export default class DropdownComponent extends Component<Props, State> {
  state = {
    expanded: false
  };

  render() {
    const { options, value, ariaLabel, extra } = this.props;
    const { expanded } = this.state;

    return (
      <span className={`dropdown ${expanded ? 'open' : ''}`}>
        <a
          tabIndex="0"
          aria-haspopup="true"
          aria-expanded="false"
          aria-label={ariaLabel}
          className="dropdown-toggle"
          onClick={this.toggleExpanded}
        >
          {this.formatTitle(value)}
          <i className="caret" />
        </a>
        {expanded &&
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
      </span>
    );
  }

  formatTitle(option: any) {
    return this.props.formatTitle(option);
  }

  toggleExpanded = () => {
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  };

  onChange = (value: any) => {
    this.props.onChange(value);
    this.setState({ expanded: false });
  };
}
