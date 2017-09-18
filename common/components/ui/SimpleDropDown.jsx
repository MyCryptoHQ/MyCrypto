// @flow
import React, { Component } from 'react';

type Props = {
  value?: string,
  options: string[],
  onChange: (value: string) => void
};

export default class SimpleDropDown extends Component {
  props: Props;
  state: {
    expanded: boolean
  } = {
    expanded: false
  };

  toggleExpanded = () => {
    this.setState(state => {
      return { expanded: !state.expanded };
    });
  };

  onClick = (event: SyntheticInputEvent) => {
    const value = event.target.getAttribute('data-value') || '';
    this.props.onChange(value);
    this.setState({ expanded: false });
  };

  render() {
    const { options, value } = this.props;
    const { expanded } = this.state;
    return (
      <div className={`dropdown ${expanded ? 'open' : ''}`}>
        <a
          className="btn btn-default dropdown-toggle"
          onClick={this.toggleExpanded}
        >
          {value}
          <i className="caret" />
        </a>

        {expanded &&
          <ul className="dropdown-menu dropdown-menu-right">
            {options.map((option, i) => {
              return (
                <li key={i}>
                  <a
                    className={option === value ? 'active' : ''}
                    onClick={this.onClick}
                    data-value={option}
                  >
                    {option}
                  </a>
                </li>
              );
            })}
          </ul>}
      </div>
    );
  }
}
