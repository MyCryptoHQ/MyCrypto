import React from 'react';
import './index.scss';
import { Input } from 'components/ui';
import { toWei, fromWei, getDecimalFromEtherUnit, UnitKey } from 'libs/units';

interface UnitNames {
  [propName: string]: string;
}

const unitNames: UnitNames = {
  wei: 'wei',
  kwei: 'kwei',
  mwei: 'mwei',
  gwei: 'gwei (shannon)',
  szabo: 'szabo',
  finney: 'finney',
  ether: 'ether',
  kether: 'kether',
  mether: 'mether',
  gether: 'gether',
  tether: 'tether'
};

interface Units {
  [propName: string]: number | '';
}

interface State {
  units: Units;
}

export default class ConvertUnits extends React.Component<State> {
  public state: State = {
    units: {
      ether: 1
    }
  };

  public componentDidMount() {
    this.convertUnits('1', 'ether');
  }

  public render() {
    const { units } = this.state;

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers">
            <h1>Convert Ethereum Units (e.g. Ether &#60;-&#62; Wei)</h1>
            <h2>Ether Wei Converter</h2>

            {Object.keys(unitNames).map(unitName => (
              <label className="input-group input-group-inline" key={unitName}>
                <Input
                  value={units[unitName]}
                  type="number"
                  onChange={this.onChange}
                  name={unitName}
                  isValid={true}
                />
                <span className={`input-group-addon ${unitName === 'ether' ? 'ether-addon' : ''}`}>
                  {unitNames[unitName]}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    );
  }

  private convertUnits(value: string, unit: UnitKey) {
    const weiValue = toWei(value, getDecimalFromEtherUnit(unit));

    const currentValues: Units = { ...this.state.units };

    Object.keys(unitNames).forEach((unitName: UnitKey) => {
      currentValues[unitName] = !weiValue.isZero() ? Number(fromWei(weiValue, unitName)) : '';
    });

    this.setState({
      units: currentValues
    });
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.convertUnits(event.currentTarget.value, event.currentTarget.name as UnitKey);
  };
}
