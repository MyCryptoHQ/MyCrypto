import React from 'react';
import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import ERC20 from 'libs/erc20';
import { shepherdProvider } from 'libs/nodes';
import { isPositiveIntegerOrZero } from 'libs/validators';
import { translateRaw } from 'translations';

interface OwnProps {
  address?: string;
  onChange(decimals: string, isValid: boolean): void;
}

interface State {
  decimals: string;
  autoDecimal: boolean;
  isErr: boolean;
  loading: boolean;
}

export class DecimalField extends React.Component<OwnProps, State> {
  private currentRequest: Promise<any> | null;

  public state: State = {
    isErr: false,
    autoDecimal: true,
    decimals: '',
    loading: false
  };

  static getDerivedStateFromProps(nextProps: OwnProps): Partial<State> | null {
    if (nextProps.address) {
      return { loading: true, autoDecimal: true };
    }
    return null;
  }

  public componentDidUpdate() {
    if (this.props.address && this.state.loading) {
      this.attemptToLoadDecimals(this.props.address);
    }
  }

  public componentWillUnmount() {
    if (this.currentRequest) {
      this.currentRequest = null;
    }
  }
  public render() {
    const { isErr, decimals, autoDecimal, loading } = this.state;

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
            name="Decimals"
            readOnly={autoDecimal}
            value={decimals}
            onChange={this.handleFieldChange}
          />
        )}
        {isErr && <div className="AddCustom-field-error">Invalid decimal</div>}
      </label>
    );
  }

  private handleFieldChange(args: React.FormEvent<HTMLInputElement>) {
    const decimals = args.currentTarget.value;
    const validDecimals = isPositiveIntegerOrZero(Number(decimals));

    this.setState({ decimals, isErr: !validDecimals });
    this.props.onChange(decimals, validDecimals);
  }

  private attemptToLoadDecimals(address: string) {
    const req = this.loadDecimals(address);

    // process request
    this.currentRequest = req
      // set state on successful request e.g it was not cancelled
      // and then also set our current request to null
      .then(({ decimals }) =>
        this.setState({
          decimals,
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
        this.setState({ autoDecimal: false, loading: false });
      })
      .then(() => (this.currentRequest = null));
  }

  private loadDecimals(address: string) {
    return shepherdProvider
      .sendCallRequest({ data: ERC20.decimals.encodeInput(), to: address })
      .then(ERC20.decimals.decodeOutput)
      .then(({ decimals }) => {
        this.props.onChange(decimals, true);
        return { decimals };
      });
  }
}
