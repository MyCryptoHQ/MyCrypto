import React from 'react';
import { HELP_ARTICLE } from 'config';
import { isPositiveIntegerOrZero, isValidETHAddress } from 'libs/validators';
import translate, { translateRaw } from 'translations';
import { HelpLink, Input } from 'components/ui';
import './AddCustomTokenForm.scss';
import { Token } from 'types/network';

interface Props {
  allTokens: Token[];
  onSave(params: Token): void;
  toggleForm(): void;
}

interface IGenerateSymbolLookup {
  [tokenSymbol: string]: boolean;
}

interface IGenerateAddressLookup {
  [address: string]: boolean;
}

interface State {
  tokenSymbolLookup: IGenerateSymbolLookup;
  tokenAddressLookup: IGenerateAddressLookup;
  address: string;
  symbol: string;
  decimal: string;
}

export default class AddCustomTokenForm extends React.PureComponent<Props, State> {
  public state: State = {
    tokenSymbolLookup: this.generateSymbolLookup(),
    tokenAddressLookup: this.generateAddressMap(),
    address: '',
    symbol: '',
    decimal: ''
  };

  public render() {
    const { address, symbol, decimal } = this.state;
    const errors = this.getErrors();

    const fields = [
      {
        name: 'symbol',
        value: symbol,
        label: translateRaw('TOKEN_SYMBOL')
      },
      {
        name: 'address',
        value: address,
        label: translateRaw('TOKEN_ADDR')
      },
      {
        name: 'decimal',
        value: decimal,
        label: translateRaw('TOKEN_DEC')
      }
    ];

    return (
      <form className="AddCustom" onSubmit={this.onSave}>
        {fields.map(field => {
          return (
            <label className="AddCustom-field form-group" key={field.name}>
              <div className="input-group-header">{field.label}</div>
              <Input
                isValid={!errors[field.name]}
                className="input-group-input-small"
                type="text"
                name={field.name}
                value={field.value}
                onChange={this.onFieldChange}
              />
              {errors[field.name] && (
                <div className="AddCustom-field-error">{errors[field.name]}</div>
              )}
            </label>
          );
        })}

        <HelpLink article={HELP_ARTICLE.ADDING_NEW_TOKENS} className="AddCustom-buttons-help">
          {translate('ADD_CUSTOM_TKN_HELP')}
        </HelpLink>
        <div className="AddCustom-buttons">
          <button
            className="AddCustom-buttons-btn btn btn-sm btn-default"
            onClick={this.props.toggleForm}
          >
            {translate('ACTION_2')}
          </button>
          <button
            className="AddCustom-buttons-btn btn btn-primary btn-sm"
            disabled={!this.isValid()}
          >
            {translate('X_SAVE')}
          </button>
        </div>
      </form>
    );
  }

  public getErrors() {
    const { address, symbol, decimal } = this.state;
    const errors: { [key: string]: string } = {};

    // Formatting errors
    if (decimal && !isPositiveIntegerOrZero(Number(decimal))) {
      errors.decimal = 'Invalid decimal';
    }
    if (address) {
      if (!isValidETHAddress(address)) {
        errors.address = 'Not a valid address';
      }
      if (this.state.tokenAddressLookup[address]) {
        errors.address = 'A token with this address already exists';
      }
    }

    // Message errors
    if (symbol && this.state.tokenSymbolLookup[symbol]) {
      errors.symbol = 'A token with this symbol already exists';
    }

    return errors;
  }

  public isValid() {
    const { address, symbol, decimal } = this.state;
    return !Object.keys(this.getErrors()).length && address && symbol && decimal;
  }

  public onFieldChange = (e: React.FormEvent<HTMLInputElement>) => {
    // TODO: typescript bug: https://github.com/Microsoft/TypeScript/issues/13948
    const name: any = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState({ [name]: value });
  };

  public onSave = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { address, symbol, decimal } = this.state;
    this.props.onSave({ address, symbol, decimal: parseInt(decimal, 10) });
  };

  private generateSymbolLookup() {
    return this.tknArrToMap('symbol');
  }

  private generateAddressMap() {
    return this.tknArrToMap('address');
  }

  private tknArrToMap(key: Exclude<keyof Token, 'error'>) {
    const tokens = this.props.allTokens;
    return tokens.reduce<{ [k: string]: boolean }>((prev, tk) => {
      prev[tk[key]] = true;
      return prev;
    }, {});
  }
}
