import React, { Component } from 'react';

interface Props<T> {
  value: T;
  options: T[];
  ariaLabel: string;
  extra?: any;
  formatTitle(option: T): any;
  onChange(value: T): void;
}

interface State {
  expanded: boolean;
}

export default class DropdownComponent<T> extends Component<Props<T>, State> {
  public state = {
    expanded: false
  };

  public render() {
    const { options, value, ariaLabel, extra } = this.props;
    const { expanded } = this.state;

    return (
      <span className={`dropdown ${expanded ? 'open' : ''}`}>
        <a
          tabIndex={0}
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

  public formatTitle(option: any) {
    return this.props.formatTitle(option);
  }

  public toggleExpanded = () => {
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  };

  public onChange = (value: any) => {
    this.props.onChange(value);
    this.setState({ expanded: false });
  };
}
