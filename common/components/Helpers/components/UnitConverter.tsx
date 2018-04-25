import React from 'react';
import UnitInput from './UnitInput';
import { UnitKey, unitToUnit } from 'libs/units';
import ETHReferenceGuide from './ETHReferenceGuide';

const unitNames: UnitKey[] = [
  'wei',
  'kwei',
  'ada',
  'femtoether',
  'mwei',
  'babbage',
  'picoether',
  'gwei',
  'shannon',
  'nanoether',
  'nano',
  'szabo',
  'microether',
  'micro',
  'finney',
  'milliether',
  'milli',
  'ether',
  'kether',
  'grand',
  'einstein',
  'mether',
  'gether',
  'tether'
];

interface State {
  units: any;
}

export default class UnitConverter extends React.Component<{}, State> {
  public state: State = {
    units: {
      ether: 1
    }
  };

  public componentDidMount() {
    this.convertUnit('ether', '1');
  }

  public render() {
    const { units } = this.state;
    return (
      <div className="Helper">
        <h1 className="Helper-title">{`Convert Ethererum Units (e.g. Ether <-> Wei)`}</h1>
        <h2 className="Helper-title">Ether Wei Converter</h2>
        <UnitInput displayUnit="wei" unitValue={units.wei} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="kwei" unitValue={units.kwei} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="mwei" unitValue={units.mwei} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="gwei" unitValue={units.gwei} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="szabo" unitValue={units.szabo} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="finney" unitValue={units.finney} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="ether" unitValue={units.ether} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="kether" unitValue={units.kether} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="mether" unitValue={units.mether} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="gether" unitValue={units.gether} onUnitChange={this.convertUnit} />
        <UnitInput displayUnit="tether" unitValue={units.tether} onUnitChange={this.convertUnit} />
        <ETHReferenceGuide />
      </div>
    );
  }
  private convertUnit = (currentUnit: UnitKey, currentValue: string) => {
    const updatedUnits: any = {};
    unitNames.forEach(unit => {
      if (currentUnit !== unit) {
        const updatedValue =
          currentValue === '' ? currentValue : unitToUnit(Number(currentValue), currentUnit, unit);
        updatedUnits[unit] = updatedValue;
      } else {
        updatedUnits[currentUnit] =
          currentValue === '' || currentValue === undefined ? currentValue : Number(currentValue);
      }
    });

    this.setState({
      units: updatedUnits
    });
  };
}
