// @flow
import React, { Component } from 'react';

type Props<T> = {
  value: T,
  options: T[],
  ariaLabel: string,
  formatTitle: (option: T) => any,
  extra?: any,
  onChange: (value: T) => void
};

type State = {
  expanded: boolean
};

export default class DropdownComponent<T: *> extends Component<
  void,
  Props<T>,
  State
> {
  props: Props<T>;

  state = {
    expanded: false
  };

  render() {
    const { options, value, ariaLabel, extra } = this.props;

    return (
      <span className="dropdown">
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
        {this.state.expanded &&
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
