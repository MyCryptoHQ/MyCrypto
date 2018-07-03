import React from 'react';
import { Result } from 'mycrypto-nano-result';

import { HELP_ARTICLE } from 'config';
import translate from 'translations';
import { Token } from 'types/network';
import { HelpLink } from 'components/ui';
import { AddressField } from './AddressField';
import { DecimalField } from './DecimalField';
import { SymbolField } from './SymbolField';
import { BalanceField } from './BalanceField';
import './AddCustomTokenForm.scss';

interface Props {
  allTokens: Token[];
  onSave(params: Token): void;
  toggleForm(): void;
}

export interface IGenerateSymbolLookup {
  [tokenSymbol: string]: boolean;
}

export interface IGenerateAddressLookup {
  [address: string]: boolean;
}

interface State {
  address: Result<string>;
  symbol: Result<string>;
  decimal: Result<string>;
}

export class AddCustomTokenForm extends React.PureComponent<Props, State> {
  public state: State = {
    address: Result.from({ err: 'This field is empty' }),
    symbol: Result.from({ err: 'This field is empty' }),
    decimal: Result.from({ err: 'This field is empty' })
  };

  private tokenSymbolLookup = this.generateSymbolLookup();
  private tokenAddressLookup = this.generateAddressMap();

  public render() {
    const address = this.state.address.toVal().res;

    return (
      <form className="AddCustom" onSubmit={this.onSave}>
        <AddressField
          addressLookup={this.tokenAddressLookup}
          onChange={this.handleFieldChange('address')}
        />
        <DecimalField address={address} onChange={this.handleFieldChange('decimal')} />
        <SymbolField
          address={address}
          symbolLookup={this.tokenSymbolLookup}
          onChange={this.handleFieldChange('symbol')}
        />
        <BalanceField address={address} />
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

  public onSave = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { address, symbol, decimal } = this.state;
    this.props.onSave({
      address: address.unwrap(),
      symbol: symbol.unwrap(),
      decimal: parseInt(decimal.unwrap(), 10)
    });
  };

  private handleFieldChange = (fieldName: keyof State) => (res: Result<string>) => {
    this.setState({ [fieldName as any]: res });
  };

  private isValid() {
    const { address, decimal, symbol } = this.state;
    const valid = address.ok() && decimal.ok() && symbol.ok();
    return valid;
  }

  private generateSymbolLookup() {
    return this.tokenArrayToMap('symbol');
  }

  private generateAddressMap() {
    return this.tokenArrayToMap('address');
  }

  private tokenArrayToMap(key: Exclude<keyof Token, 'error'>) {
    const tokens = this.props.allTokens;
    return tokens.reduce<{ [k: string]: boolean }>((prev, tk) => {
      prev[tk[key]] = true;
      return prev;
    }, {});
  }
}
