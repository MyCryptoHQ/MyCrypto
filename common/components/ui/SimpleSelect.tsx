import React, { Component } from 'react';

interface Props {
  value?: string;
  options: string[];
  onChange(event: React.FormEvent<HTMLSpanElement>): void;
}

export default class SimpleSelect extends Component<Props, {}> {
  public render() {
    return (
      <select
        value={this.props.value || this.props.options[0]}
        className={'form-control'}
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
