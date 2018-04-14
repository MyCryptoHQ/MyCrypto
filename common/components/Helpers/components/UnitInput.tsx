import React, { Component } from 'react';
import './UnitInput.scss';
import { Input } from 'components/ui';
// import { toWei, getDecimalFromEtherUnit, fromWei, Wei } from 'libs/units';

interface State {
  unit: any;
}

interface Props {
  displayUnit: string;
  handleUnitChange: ((unit: string) => string);
}

class UnitInput extends Component<Props, State> {
  public state = {
    unit: {
      ether: 1
    }
  };

  public render() {
    const { displayUnit } = this.props;

    return (
      <form className="ENSInput">
        <div className="input-group-wrapper">
          <label className="input-group input-group-inline ENSInput-name">
            <Input value={0} type="text" onChange={this.onChange} />
            <span className="input-group-addon">{displayUnit}</span>
          </label>
        </div>
      </form>
    );
  }

  // add delay to namehash computation / getting the availability
  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.props.handleUnitChange(this.props.displayUnit);
  };
}

export default UnitInput;
