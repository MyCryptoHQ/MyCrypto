// @flow
import React from 'react';
import { isValidETHAddress, isPositiveIntegerOrZero } from 'libs/validators';
import translate from 'translations';

export default class AddCustomTokenForm extends React.Component {
  props: {
    onSave: ({ address: string, symbol: string, decimal: number }) => void
  };
  state = {
    address: '',
    symbol: '',
    decimal: ''
  };

  render() {
    return (
      <div className="custom-token-fields">
        <label>
          {translate('TOKEN_Addr')}
        </label>
        <input
          className={
            'form-control input-sm ' +
            (isValidETHAddress(this.state.address) ? 'is-valid' : 'is-invalid')
          }
          type="text"
          name="address"
          value={this.state.address}
          onChange={this.onFieldChange}
        />
        <label>
          {translate('TOKEN_Symbol')}
        </label>
        <input
          className={
            'form-control input-sm ' +
            (this.state.symbol !== '' ? 'is-valid' : 'is-invalid')
          }
          type="text"
          name="symbol"
          value={this.state.symbol}
          onChange={this.onFieldChange}
        />
        <label>
          {translate('TOKEN_Dec')}
        </label>
        <input
          className={
            'form-control input-sm ' +
            (isPositiveIntegerOrZero(parseInt(this.state.decimal))
              ? 'is-valid'
              : 'is-invalid')
          }
          type="text"
          name="decimal"
          value={this.state.decimal}
          onChange={this.onFieldChange}
        />
        <div
          className={`btn btn-primary btn-sm ${this.isValid()
            ? ''
            : 'disabled'}`}
          onClick={this.onSave}
        >
          {translate('x_Save')}
        </div>
      </div>
    );
  }

  isValid() {
    const { address, symbol, decimal } = this.state;
    if (!isPositiveIntegerOrZero(parseInt(decimal))) {
      return false;
    }
    if (!isValidETHAddress(address)) {
      return false;
    }
    if (symbol === '') {
      return false;
    }

    return true;
  }

  onFieldChange = (e: SyntheticInputEvent) => {
    var name = e.target.name;
    var value = e.target.value;
    this.setState(state => {
      var newState = Object.assign({}, state);
      newState[name] = value;
      return newState;
    });
  };

  onSave = () => {
    if (!this.isValid()) {
      return;
    }
    const { address, symbol, decimal } = this.state;

    this.props.onSave({ address, symbol, decimal: parseInt(decimal) });
  };
}
