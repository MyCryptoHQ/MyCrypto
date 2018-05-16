import React from 'react';
import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import ERC20 from 'libs/erc20';
import { shepherdProvider } from 'libs/nodes';
import { translateRaw } from 'translations';
import { IGenerateSymbolLookup } from './AddCustomTokenForm';
import { Result } from 'nano-result';

interface OwnProps {
  address?: string;
  symbolLookup: IGenerateSymbolLookup;
  onChange(symbol: Result<string>): void;
}

interface State {
  symbol: Result<string>;
  autoSymbol: boolean;
  userInput: string;
  addressToLoad?: string;
  loading: boolean;
}

export class SymbolField extends React.Component<OwnProps, State> {
  private currentRequest: Promise<any> | null;

  public state: State = {
    userInput: '',
    autoSymbol: true,
    symbol: Result.from({ res: '' }),
    loading: false
  };

  static getDerivedStateFromProps(nextProps: OwnProps, prevState: State): Partial<State> | null {
    if (nextProps.address && nextProps.address !== prevState.addressToLoad) {
      return { loading: true, autoSymbol: true, addressToLoad: nextProps.address };
    }
    return null;
  }

  public componentDidUpdate() {
    if (this.state.addressToLoad && this.state.loading) {
      this.attemptToLoadSymbol(this.state.addressToLoad);
    }
  }

  public componentWillUnmount() {
    if (this.currentRequest) {
      this.currentRequest = null;
    }
  }
  public render() {
    const { userInput, symbol, autoSymbol, loading } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">{translateRaw('TOKEN_SYMBOL')}</div>
        {loading ? (
          <Spinner />
        ) : (
          <Input
            isValid={symbol.ok()}
            className="input-group-input-small"
            type="text"
            name="Symbol"
            readOnly={autoSymbol}
            value={symbol.ok() ? symbol.unwrap() : userInput}
            onChange={this.handleFieldChange}
          />
        )}
        {symbol.err() && <div className="AddCustom-field-error">{symbol.err()}</div>}
      </label>
    );
  }

  private handleFieldChange = (args: React.FormEvent<HTMLInputElement>) => {
    const userInput = args.currentTarget.value;
    const validSymbol = !this.props.symbolLookup[userInput];
    const symbol: Result<string> = validSymbol
      ? Result.from({ res: userInput })
      : Result.from({ err: 'A token with this symbol already exists' });

    this.setState({ userInput, symbol });
    this.props.onChange(symbol);
  };

  private attemptToLoadSymbol(address: string) {
    const req = this.loadSymbols(address);

    // process request
    this.currentRequest = req
      // set state on successful request e.g it was not cancelled
      // and then also set our current request to null
      .then(({ symbol }) =>
        this.setState({
          symbol,
          loading: false,
          autoSymbol: symbol.err() ? false : true
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
        const result: Result<string> = symbol
          ? Result.from({ res: symbol })
          : Result.from({ err: 'No Symbol found, please input the token symbol manually' });
        this.props.onChange(result);
        return { symbol: result };
      });
  }
}
