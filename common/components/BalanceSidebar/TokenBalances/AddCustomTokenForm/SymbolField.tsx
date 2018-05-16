import React from 'react';
import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import ERC20 from 'libs/erc20';
import { shepherdProvider } from 'libs/nodes';
import { translateRaw } from 'translations';
import { IGenerateSymbolLookup } from './AddCustomTokenForm';

interface OwnProps {
  address?: string;
  symbolLookup: IGenerateSymbolLookup;
  onChange(symbol: string, isValid: boolean): void;
}

interface State {
  symbol: string;
  autoSymbol: boolean;
  isErr: boolean;
  loading: boolean;
}

export class SymbolField extends React.Component<OwnProps, State> {
  private currentRequest: Promise<any> | null;

  public state: State = {
    isErr: false,
    autoSymbol: true,
    symbol: '',
    loading: false
  };

  static getDerivedStateFromProps(nextProps: OwnProps): Partial<State> | null {
    if (nextProps.address) {
      return { loading: true, autoSymbol: true };
    }
    return null;
  }

  public componentDidUpdate() {
    if (this.props.address && this.state.loading) {
      this.attemptToLoadSymbol(this.props.address);
    }
  }

  public componentWillUnmount() {
    if (this.currentRequest) {
      this.currentRequest = null;
    }
  }
  public render() {
    const { isErr, symbol, autoSymbol, loading } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">{translateRaw('TOKEN_DEC')}</div>
        {loading ? (
          <Spinner />
        ) : (
          <Input
            isValid={isErr}
            className="input-group-input-small"
            type="text"
            name="Symbol"
            readOnly={autoSymbol}
            value={symbol}
            onChange={this.handleFieldChange}
          />
        )}
        {isErr && (
          <div className="AddCustom-field-error">A token with this symbol already exists</div>
        )}
      </label>
    );
  }

  private handleFieldChange(args: React.FormEvent<HTMLInputElement>) {
    const symbol = args.currentTarget.value;
    const validSymbol = !this.props.symbolLookup[symbol];

    this.setState({ symbol, isErr: !validSymbol });
    this.props.onChange(symbol, validSymbol);
  }

  private attemptToLoadSymbol(address: string) {
    const req = this.loadSymbols(address);

    // process request
    this.currentRequest = req
      // set state on successful request e.g it was not cancelled
      // and then also set our current request to null
      .then(({ symbol }) =>
        this.setState({
          symbol,
          isErr: false,
          loading: false
        })
      )
      .catch(e => {
        console.error(e);
        // if the component is unmounted, then dont call set state
        if (!this.currentRequest) {
          return;
        }

        // otherwise it was a failed fetch call
        this.setState({ autoSymbol: false, loading: false });
      })
      .then(() => (this.currentRequest = null));
  }

  private loadSymbols(address: string) {
    return shepherdProvider
      .sendCallRequest({ data: ERC20.symbol.encodeInput(), to: address })
      .then(ERC20.symbol.decodeOutput)
      .then(({ symbol }) => {
        this.props.onChange(symbol, true);
        return { symbol };
      });
  }
}
