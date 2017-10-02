import React from 'react';
import SimpleDropdown from 'components/ui/SimpleDropdown';

interface UnitDropdownProps {
  value: string;
  options: string[];
  onChange?(value: string): void;
}
interface State {
  expanded: boolean;
}
export default class UnitDropdown extends React.Component<
  UnitDropdownProps,
  State
> {
  public state = {
    expanded: false
  };

  public render() {
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

  public onChange = (value: string) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
