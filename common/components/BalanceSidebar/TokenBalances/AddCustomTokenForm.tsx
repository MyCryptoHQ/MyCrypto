import React from 'react';
import classnames from 'classnames';
import { Token } from 'config/data';
import { isPositiveIntegerOrZero, isValidETHAddress } from 'libs/validators';
import translate from 'translations';
import NewTabLink from 'components/ui/NewTabLink';
import './AddCustomTokenForm.scss';

interface Props {
  allTokens: Token[];
  onSave(params: Token): void;
  toggleForm(): void;
}

interface IGenerateSymbolLookup {
  [tokenSymbol: string]: boolean;
}

interface State {
  tokenSymbolLookup: IGenerateSymbolLookup;
  address: string;
  symbol: string;
  decimal: string;
}

export default class AddCustomTokenForm extends React.Component<Props, State> {
  public state: State = {
    tokenSymbolLookup: {},
    address: '',
    symbol: '',
    decimal: ''
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      tokenSymbolLookup: this.generateSymbolLookup(props.allTokens)
    };
  }

  public render() {
    const { address, symbol, decimal } = this.state;
    const inputClasses = 'AddCustom-field-input form-control input-sm';
    const errors = this.getErrors();

    const fields = [
      {
        name: 'symbol',
        value: symbol,
        label: translate('TOKEN_Symbol')
      },
      {
        name: 'address',
        value: address,
        label: translate('TOKEN_Addr')
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
              <span className="AddCustom-field-label">{field.label}</span>
              <input
                className={classnames(
                  inputClasses,
                  errors[field.name] ? 'is-invalid' : field.value ? 'is-valid' : ''
                )}
                type="text"
                name={field.name}
                value={field.value}
                onChange={this.onFieldChange}
              />
              {typeof errors[field.name] === 'string' && (
                <div className="AddCustom-field-error">{errors[field.name]}</div>
              )}
            </label>
          );
        })}

        <div className="AddCustom-buttons">
          <NewTabLink
            href="https://myetherwallet.github.io/knowledge-base/send/adding-new-token-and-sending-custom-tokens.html"
            className="AddCustom-buttons-help"
          >
            {translate('Need help? Learn how to add custom tokens.')}
          </NewTabLink>
          <button
            className="AddCustom-buttons-btn btn btn-primary btn-sm"
            disabled={!this.isValid()}
          >
            {translate('x_Save')}
          </button>
          <button
            className="AddCustom-buttons-btn btn btn-sm btn-default"
            onClick={this.props.toggleForm}
          >
            {translate('x_Cancel')}
          </button>
        </div>
      </form>
    );
  }

  public getErrors() {
    const { address, symbol, decimal } = this.state;
    const errors: { [key: string]: boolean | string } = {};

    // Formatting errors
    if (decimal && !isPositiveIntegerOrZero(parseInt(decimal, 10))) {
      errors.decimal = true;
    }
    if (address && !isValidETHAddress(address)) {
      errors.address = true;
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

  private generateSymbolLookup(tokens: Token[]) {
    return tokens.reduce(
      (prev, tk) => {
        prev[tk.symbol] = true;
        return prev;
      },
      {} as IGenerateSymbolLookup
    );
  }
}
