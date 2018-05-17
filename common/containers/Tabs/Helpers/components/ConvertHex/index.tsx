import React from 'react';
import './index.scss';
import { Input } from 'components/ui';
import BN from 'bn.js';

interface State {
  dec: BN;
  hex: string;
  hexPadded: string;
}

export default class ConvertHex extends React.Component<State> {
  public state = {
    dec: new BN(123),
    hex: '',
    hexPadded: ''
  };

  public componentDidMount() {
    this.calcFields(this.state.dec, 'dec');
  }

  public render() {
    const { dec, hex, hexPadded } = this.state;

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers">
            <h1>Convert Decimal to Hexadecimal and Hex to Dec</h1>

            <label className="input-group">
              <div className="input-group-header">Decimal</div>
              <Input
                value={dec.toString(10)}
                type="text"
                onChange={this.onChange}
                isValid={true}
                name="dec"
              />
            </label>

            <label className="input-group">
              <div className="input-group-header">Hexadecimal</div>
              <Input value={hex} type="text" onChange={this.onChange} isValid={true} name="hex" />
            </label>

            <label className="input-group">
              <div className="input-group-header">Hexadecimal - Padded Left w/ 64 characters</div>
              <Input
                value={hexPadded}
                type="text"
                isValid={true}
                name="hexPadded"
                readOnly={true}
              />
            </label>
          </div>
        </section>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.calcFields(event.currentTarget.value, event.currentTarget.name);
  };

  private calcFields(value: string | BN, name: string) {
    const currentState = { ...this.state };

    if (name === 'dec') {
      const dec = new BN(value);
      currentState.dec = dec;
      currentState.hex = this.decToHex(dec);
    }

    if (name === 'hex') {
      currentState.dec = this.hexToDec(value ? (value as string) : '0');
      currentState.hex = value as string;
    }

    currentState.hexPadded = this.hexToPadded(currentState.hex);

    this.setState(currentState);
  }

  private decToHex(value: BN) {
    return value.toString(16);
  }

  private hexToDec(value: string) {
    return new BN(value, 16);
  }

  private hexToPadded(value: string) {
    return value.length >= 64 ? value : new Array(64 - value.length + 1).join('0') + value;
  }
}
