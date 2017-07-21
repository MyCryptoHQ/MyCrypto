import React, { Component } from 'react';

type ReduxStateProps<T> = {
  value: T,
  options: Array<T>
};

type ReduxActionProps = {
  onChange: (event: SyntheticInputEvent) => void
};

export default class SimpleDropDown extends Component {
  props: ReduxStateProps & ReduxActionProps;

  render() {
    return (
      <span className="dropdown">
        <select
          value={this.props.value}
          className="btn btn-default dropdown-toggle"
          onChange={this.props.onChange}
        >
          {this.props.options.map((obj, i) => {
            return (
              <option value={obj} key={i}>
                {obj}
              </option>
            );
          })}
        </select>
      </span>
    );
  }
}
