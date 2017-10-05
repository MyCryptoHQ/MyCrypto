import React from 'react';
import Dropdown from 'components/ui/Dropdown';

interface UnitDropdownProps {
  value: string;
  options: string[];
  onChange?(value: string): void;
}

interface State {
  expanded: boolean;
}

const initialState = {
  expanded: false
};

export default class UnitDropdown extends React.Component<
  UnitDropdownProps,
  State
> {
  public state: State = initialState;

  public render() {
    const { value, options } = this.props;

    const StringDropdown = Dropdown as new () => Dropdown<string>;

    return (
      <div className="input-group-btn">
        <StringDropdown
          options={options}
          value={value}
          onChange={this.onChange}
          ariaLabel={'dropdown'}
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
