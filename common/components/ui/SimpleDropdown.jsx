// @flow
import React, { Component } from 'react';

type Props<T> = {
  value?: T,
  options: Array<T>,
  onChange: (event: SyntheticInputEvent) => void
};

export default class SimpleDropDown<T: *> extends Component {
  props: Props<T>;

  render() {
    return (
      <select
        value={this.props.value || this.props.options[0]}
        className="form-control"
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
    );
  }
}
