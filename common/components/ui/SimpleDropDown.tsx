import React, { Component } from 'react';

interface Props {
  value?: string;
  options: string[];
  onChange(value: string): void;
}

interface State {
  expanded: boolean;
}
export default class SimpleDropDown extends Component<Props, State> {
  public state = {
    expanded: false
  };

  public toggleExpanded = () => {
    this.setState(state => {
      return { expanded: !state.expanded };
    });
  };

  public onClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    const value = (event.target as HTMLAnchorElement).getAttribute('data-value') || '';
    this.props.onChange(value);
    this.setState({ expanded: false });
  };

  public render() {
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
