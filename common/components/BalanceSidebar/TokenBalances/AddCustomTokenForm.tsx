import classnames from 'classnames';
import { Token } from 'config/data';
import { isPositiveIntegerOrZero, isValidETHAddress } from 'libs/validators';
import React from 'react';
import translate from 'translations';

interface Props {
  onSave(params: Token): void;
}

export default class AddCustomTokenForm extends React.Component<Props, Token> {
  public state = {
    address: '',
    symbol: '',
    decimal: ''
  };

  public render() {
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

  public getErrors() {
    const { address, symbol, decimal } = this.state;
    const errors = {
      decimal: false,
      address: false,
      symbol: false
    };

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

  public isValid() {
    return !Object.keys(this.getErrors()).length;
  }

  public onFieldChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // TODO: typescript bug: https://github.com/Microsoft/TypeScript/issues/13948
    const name: any = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    this.setState({ [name as any]: value });
  };

  public onSave = (ev: React.SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { address, symbol, decimal } = this.state;
    // TODO - determine why Token decimal is a string instead of a number. 
    this.props.onSave({ address, symbol, decimal: String(parseInt(decimal, 10)) });
  };
}
