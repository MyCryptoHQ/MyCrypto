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
    this.props.onChange(event.target.value);
  };

  render() {
    const { options, value } = this.props;
    const { expanded } = this.state;
    return (
      <span className={`dropdown ${expanded ? 'open' : ''}`}>
        <a
          className="btn btn-default dropdown-toggle"
          onClick={this.toggleExpanded}
        >
          {value}
          <i className="caret" />
        </a>

        {expanded &&
          <ul
            className="dropdown-menu dropdown-menu-right"
            style={{ marginTop: '15px' }}
          >
            {options.map((option, i) => {
              return (
                <li value={option} key={i}>
                  <a
                    className={option === value ? 'active' : ''}
                    onClick={this.onClick}
                  >
                    {option}
                  </a>
                </li>
              );
            })}
          </ul>}
      </span>
    );
  }
}
