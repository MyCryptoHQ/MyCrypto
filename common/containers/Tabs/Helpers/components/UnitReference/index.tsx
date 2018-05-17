import React from 'react';
import './index.scss';
import { Units, getDecimalFromEtherUnit, UnitKey } from 'libs/units';

interface State {
  input: string;
  output: string;
}

export default class UnitReference extends React.Component<State> {
  public render() {
    const unitNames: any = {
      wei: '',
      kwei: 'ada, femtoether',
      mwei: 'babbage, picoether',
      gwei: 'shannon, nanoether, nano',
      szabo: 'microether, micro',
      finney: 'milliether, milli',
      ether: '',
      kether: 'grand, einstein',
      mether: 'mether',
      gether: 'gether',
      tether: 'tether'
    };

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Unit-ref">
            <h1>Ether Unit Reference Guide</h1>

            <table className="table table-striped">
              <tbody>
                {Object.keys(unitNames).map(unitName => (
                  <tr key={unitName}>
                    <td>
                      <strong>{unitName}</strong>
                    </td>
                    <td>{unitNames[unitName]}</td>
                    <td>{(Units as any)[unitName]}</td>
                    <td>{parseInt((Units as any)[unitName]).toLocaleString('en-US')}</td>
                    <td>
                      10<sup>{getDecimalFromEtherUnit(unitName as UnitKey)}</sup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }
}
