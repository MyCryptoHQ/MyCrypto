// @flow
import React, { Component } from 'react';

type Props = {
  value?: string,
  options: string[],
  onChange: (event: SyntheticInputEvent) => void,
  className?: string
};

export default class SimpleDropDown extends Component {
  props: Props;

  render() {
    return (
      <select
        value={this.props.value || this.props.options[0]}
        className={this.props.className || 'form-control'}
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
