import React, { Component } from 'react';
import './UnitInput.scss';
import { Input } from 'components/ui';

interface Props {
  displayUnit: string;
  onUnitChange: ((unit: string, value: string) => void);
  unitValue: string;
}

class UnitInput extends Component<Props> {
  public render() {
    const { displayUnit } = this.props;

    return (
      <form className="UnitInput">
        <div className="input-group-wrapper">
          <label className="input-group input-group-inline UnitInput-name">
            <Input value={this.props.unitValue} type="number" onChange={this.onChange} />
            <span className="input-group-addon">{displayUnit}</span>
          </label>
        </div>
      </form>
    );
  }

  // add delay to namehash computation / getting the availability
  private onChange = (event: any) => {
    let nextValue;

    nextValue = event.currentTarget.value === undefined ? '' : event.currentTarget.value;
    this.props.onUnitChange(this.props.displayUnit, nextValue);
  };
}

export default UnitInput;
