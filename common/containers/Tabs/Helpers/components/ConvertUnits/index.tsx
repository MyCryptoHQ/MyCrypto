import React from 'react';
import './index.scss';
import { Input } from 'components/ui';
import { toWei } from 'libs/units';

const unitNames = [
  'wei',
  'kwei',
  'mwei',
  'gwei (shannon)',
  'szabo',
  'finney',
  'ether',
  'kether',
  'mether',
  'gether',
  'tether'
];

interface State {
  units: any;
}

interface Props {}

export default class ConvertUnits extends React.Component<Props, State> {
  public state = {
    units: {
      ether: 1
    }
  };

  public render() {
    const { units } = this.state;

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers">
            <h1>Convert Ethereum Units (e.g. Ether &#60;-&#62; Wei)</h1>
            <h2>Ether Wei Converter</h2>

            {unitNames.map(unitName => (
              <label className="input-group input-group-inline">
                <Input
                  value={(units as any)[unitName]}
                  type="text"
                  onChange={this.onChange}
                  name={unitName}
                />
                <span className="input-group-addon">{unitName}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      units: {
        wei: toWei(event.currentTarget.value, 0)
      }
    });
  };
}
