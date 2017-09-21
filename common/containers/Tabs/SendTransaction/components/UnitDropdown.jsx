// @flow
import React from 'react';
import SimpleDropdown from 'components/ui/SimpleDropdown';

type UnitDropdownProps = {
  value: string,
  options: string[],
  onChange?: (value: string) => void
};

export default class UnitDropdown extends React.Component {
  props: UnitDropdownProps;

  state: {
    expanded: boolean
  } = {
    expanded: false
  };

  render() {
    const { value, options } = this.props;

    return (
      <div className="input-group-btn">
        <SimpleDropdown
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
