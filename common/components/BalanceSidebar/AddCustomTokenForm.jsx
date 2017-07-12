// @flow
import React from 'react';
import { isValidETHAddress, isPositiveIntegerOrZero } from 'libs/validators';
import translate from 'translations';

export default class AddCustomTokenForm extends React.Component {
  props: {
    onSave: ({ address: string, symbol: string, decimal: number }) => void
  };
  state = {
    contract: '',
    symbol: '',
    decimals: ''
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
            (isValidETHAddress(this.state.contract) ? 'is-valid' : 'is-invalid')
          }
          type="text"
          name="contract"
          value={this.state.contract}
          onChange={this.onFieldChange}
        />
        <label>
          {translate('TOKEN_Symbol')}
        </label>
        <input
          className={
            'form-control input-sm ' + (this.state.symbol !== '' ? 'is-valid' : 'is-invalid')
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
            (isPositiveIntegerOrZero(parseInt(this.state.decimals)) ? 'is-valid' : 'is-invalid')
          }
          type="text"
          name="decimals"
          value={this.state.decimals}
          onChange={this.onFieldChange}
        />
        <div
          className={`btn btn-primary btn-sm ${this.isValid() ? '' : 'disabled'}`}
          onClick={this.onSave}
        >
          {translate('x_Save')}
        </div>
      </div>
    );
  }

  isValid() {
    const { contract, symbol, decimals } = this.state;
    if (!isPositiveIntegerOrZero(parseInt(decimals))) {
      return false;
    }
    if (!isValidETHAddress(contract)) {
      return false;
    }
    if (this.state.symbol === '') {
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
    const { contract, symbol, decimals } = this.state;
    if (!this.isValid()) {
      return;
    }
    this.props.onSave({ address: contract, symbol, decimal: parseInt(this.state.decimals) });
  };
}
