// @flow
import React, { Component } from 'react';
import SimpleDropDown from 'components/ui/SimpleDropDown';

type Props = {
  value: string,
  options: string[],
  onChange?: (value: string) => void
};

type State = {
  expanded: boolean
};

export default class UnitDropdown extends Component<Props, State> {
  state = {
    expanded: false
  };

  render() {
    const { value, options } = this.props;

    return (
      <div className="input-group-btn">
        <SimpleDropDown
          value={value}
          onChange={this.onChange}
          options={options}
        />
      </div>
    );
  }

  onChange = (value: string) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
