// @flow
import React from 'react';
import classnames from 'classnames';
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
    const { address, symbol, decimal } = this.state;
    const inputClasses = 'AddCustom-field-input form-control input-sm';
    const errors = this.getErrors();

    const fields = [
      {
        name: 'address',
        value: address,
        label: translate('TOKEN_Addr')
      },
      {
        name: 'symbol',
        value: symbol,
        label: translate('TOKEN_Symbol')
      },
      {
        name: 'decimal',
        value: decimal,
        label: translate('TOKEN_Dec')
      }
    ];

    return (
      <form className="AddCustom" onSubmit={this.onSave}>
        {fields.map(field => {
          return (
            <label className="AddCustom-field form-group" key={field.name}>
              <span className="AddCustom-field-label">
                {field.label}
              </span>
              <input
                className={classnames(
                  inputClasses,
                  errors[field.name] ? 'is-invalid' : 'is-valid'
                )}
                type="text"
                name={field.name}
                value={field.value}
                onChange={this.onFieldChange}
              />
            </label>
          );
        })}

        <button
          className="btn btn-primary btn-sm btn-block"
          disabled={!this.isValid()}
        >
          {translate('x_Save')}
        </button>
      </form>
    );
  }

  getErrors() {
    const { address, symbol, decimal } = this.state;
    const errors = {};

    if (!isPositiveIntegerOrZero(parseInt(decimal, 10))) {
      errors.decimal = true;
    }
    if (!isValidETHAddress(address)) {
      errors.address = true;
    }
    if (!symbol) {
      errors.symbol = true;
    }

    return errors;
  }

  isValid() {
    return !Object.keys(this.getErrors()).length;
  }

  onFieldChange = (e: SyntheticInputEvent) => {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({ [name]: value });
  };

  onSave = (ev: SyntheticInputEvent) => {
    ev.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { address, symbol, decimal } = this.state;
    this.props.onSave({ address, symbol, decimal: parseInt(decimal, 10) });
  };
}
