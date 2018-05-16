import React from 'react';
import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import ERC20 from 'libs/erc20';
import { shepherdProvider } from 'libs/nodes';
import { isPositiveIntegerOrZero } from 'libs/validators';
import { translateRaw } from 'translations';
import { Result } from 'nano-result';

interface OwnProps {
  address?: string;
  onChange(decimals: Result<string>): void;
}

interface State {
  userInput: string;
  decimals: Result<string>;
  autoDecimal: boolean;
  addressToLoad?: string;
  loading: boolean;
}

export class DecimalField extends React.Component<OwnProps, State> {
  public static getDerivedStateFromProps(
    nextProps: OwnProps,
    prevState: State
  ): Partial<State> | null {
    if (nextProps.address && nextProps.address !== prevState.addressToLoad) {
      return { loading: true, autoDecimal: true, addressToLoad: nextProps.address };
    }
    return null;
  }

  public state: State = {
    userInput: '',
    autoDecimal: true,
    decimals: Result.from({ res: '' }),
    loading: false
  };

  private currentRequest: Promise<any> | null;

  public componentDidUpdate() {
    if (this.state.addressToLoad && this.state.loading) {
      this.attemptToLoadDecimals(this.state.addressToLoad);
    }
  }

  public componentWillUnmount() {
    if (this.currentRequest) {
      this.currentRequest = null;
    }
  }
  public render() {
    const { decimals, autoDecimal, loading, userInput } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">{translateRaw('TOKEN_DEC')}</div>
        {loading ? (
          <Spinner />
        ) : (
          <Input
            isValid={decimals.ok()}
            className="input-group-input-small"
            type="text"
            name="Decimals"
            readOnly={autoDecimal}
            value={decimals.ok() ? decimals.unwrap() : userInput}
            onChange={this.handleFieldChange}
          />
        )}
        {decimals.err() && <div className="AddCustom-field-error">{decimals.err()}</div>}
      </label>
    );
  }

  private handleFieldChange = (args: React.FormEvent<HTMLInputElement>) => {
    const userInput = args.currentTarget.value;
    const validDecimals = isPositiveIntegerOrZero(Number(userInput));
    const decimals: Result<string> = validDecimals
      ? Result.from({ res: userInput })
      : Result.from({ err: 'Invalid decimal' });

    this.setState({ decimals, userInput });
    this.props.onChange(decimals);
  };

  private attemptToLoadDecimals(address: string) {
    const req = this.loadDecimals(address);

    // process request
    this.currentRequest = req
      // set state on successful request e.g it was not cancelled
      // and then also set our current request to null
      .then(({ decimals }) =>
        this.setState({
          decimals,
          loading: false,
          autoDecimal: decimals.toVal().res === '0' ? false : true
        })
      )
      .catch(e => {
        console.error(e);
        // if the component is unmounted, then dont call set state
        if (!this.currentRequest) {
          return;
        }

        // otherwise it was a failed fetch call
        this.setState({ autoDecimal: false, loading: false });
      })
      .then(() => (this.currentRequest = null));
  }

  private loadDecimals(address: string) {
    return shepherdProvider
      .sendCallRequest({ data: ERC20.decimals.encodeInput(), to: address })
      .then(ERC20.decimals.decodeOutput)
      .then(({ decimals }) => {
        const result = Result.from({ res: decimals });
        this.props.onChange(result);
        return { decimals: result };
      });
  }
}
