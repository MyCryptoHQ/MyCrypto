import React from 'react';
import { HELP_ARTICLE } from 'config';
import { AddressField } from './AddressField';
import { DecimalField } from './DecimalField';
import { SymbolField } from './SymbolField';
import translate from 'translations';
import { HelpLink } from 'components/ui';
import './AddCustomTokenForm.scss';
import { Token } from 'types/network';

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
  address: string;
  symbol: string;
  decimal: string;
}

export default class AddCustomTokenForm extends React.PureComponent<Props, State> {
  private tokenSymbolLookup = this.generateSymbolLookup();
  private tokenAddressLookup = this.generateAddressMap();

  public state: State = {
    address: '',
    symbol: '',
    decimal: ''
  };

  public render() {
    return (
      <form className="AddCustom" onSubmit={this.onSave}>
        <AddressField addressLookup={this.tokenAddressLookup} onChange={} />
        <DecimalField address={} onChange={} />
        <SymbolField address={} symbolLookup={this.tokenSymbolLookup} onChange={} />

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

  public isValid() {
    const { address, symbol, decimal } = this.state;
    return !Object.keys(this.getErrors()).length && address && symbol && decimal;
  }

  public onSave = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { address, symbol, decimal } = this.state;
    this.props.onSave({ address, symbol, decimal });
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
