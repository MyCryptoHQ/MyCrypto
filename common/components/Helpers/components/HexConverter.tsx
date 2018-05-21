import React from 'react';
import { decimalToHex, hexToDecimal, padLeft } from 'utils/formatters';
import { Input } from 'components/ui';

interface State {
  decimalInput: string | number;
  hexInput: string;
  hexPaddedInput: string;
}

export default class HexConverter extends React.Component<{}, State> {
  public state: State = {
    decimalInput: 10,
    hexInput: decimalToHex(10),
    hexPaddedInput: padLeft(decimalToHex(10), 64, '0')
  };

  public render() {
    return (
      <div className="Helper">
        <h1 className="Helper-title">Convert Decimal to Hexidecimal and Hex to Decimal</h1>
        <div className="form-group">
          <label>Decimal</label>
          <Input value={this.state.decimalInput} type="number" onChange={this.onDecimalChange} />
          <label>Hexadecimal</label>
          <Input value={this.state.hexInput} type="text" onChange={this.onHexChange} />
          <label>Hexadecimal - Padded Left w/ 64 characters</label>
          <Input value={this.state.hexPaddedInput} type="text" readOnly={true} />
        </div>
      </div>
    );
  }

  private onDecimalChange = (event: any) => {
    const nextValue = event.currentTarget.value === undefined ? '' : event.currentTarget.value;
    const nextHexValue = decimalToHex(nextValue);

    this.setState({
      decimalInput: nextValue,
      hexInput: nextHexValue,
      hexPaddedInput: padLeft(nextHexValue, 64, '0')
    });
  };

  private onHexChange = (event: any) => {
    let nextValue;

    nextValue = event.currentTarget.value === undefined ? '' : event.currentTarget.value;

    this.setState({
      decimalInput: hexToDecimal(nextValue),
      hexInput: nextValue,
      hexPaddedInput: padLeft(nextValue, 64, '0')
    });
  };
}
