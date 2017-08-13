// @flow
import React from "react";

class Option extends React.Component {
  props: {
    value: string,
    active: boolean,
    onChange: (value: string) => void
  };
  render() {
    const { value, active } = this.props;
    return (
      <li>
        <a className={active ? "active" : ""} onClick={this.onChange}>
          {value}
        </a>
      </li>
    );
  }

  onChange = () => {
    this.props.onChange(this.props.value);
  };
}

export default class UnitDropdown extends React.Component {
  props: {
    value: string,
    options: string[],
    onChange?: (value: string) => void
  };
  state: {
    expanded: boolean
  } = {
    expanded: false
  };

  render() {
    const { value, options, onChange } = this.props;
    const isReadonly = !onChange;

    return (
      <div className="input-group-btn">
        <a
          style={{ minWidth: 170 }}
          className="btn btn-default dropdown-toggle"
          onClick={this.onToggleExpand}
        >
          <strong>
            {value}
            <i className="caret" />
          </strong>
        </a>
        {this.state.expanded &&
          !isReadonly &&
          <ul className="dropdown-menu dropdown-menu-right">
            {options.map(o =>
              <Option
                key={o}
                active={value === o}
                value={o}
                onChange={this.onChange}
              />
            )}
          </ul>}
      </div>
    );
  }

  onToggleExpand = () => {
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  };

  onChange = (value: string) => {
    this.setState({
      expanded: false
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
