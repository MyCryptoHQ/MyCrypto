import React from 'react';
import './index.scss';
import { Input } from 'components/ui';
import { toWei, fromWei, getDecimalFromEtherUnit, UnitKey } from 'libs/units';

const unitNames = {
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

interface State {
  units: any;
}

// interface Props {}

export default class ConvertUnits extends React.Component<State> {
  public state = {
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
              <label className="input-group input-group-inline">
                <Input
                  value={(units as any)[unitName]}
                  type="text"
                  onChange={this.onChange}
                  name={unitName}
                />
                <span className={`input-group-addon ${unitName === 'ether' ? 'ether-addon' : ''}`}>
                  {(unitNames as any)[unitName]}
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

    const currentValues: any = {};

    Object.keys(unitNames).forEach((unitName: UnitKey) => {
      currentValues[unitName] = fromWei(weiValue, unitName);
    });

    this.setState({
      units: currentValues
    });
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.convertUnits(event.currentTarget.value, event.currentTarget.name as UnitKey);
  };
}
