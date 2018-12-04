import React from 'react';
import { Result } from 'mycrypto-nano-result';

import { shepherdProvider } from 'libs/nodes';
import ERC20 from 'libs/erc20';
import Spinner from 'components/ui/Spinner';
import { Input } from 'components/ui';

interface OwnProps {
  fieldToFetch: keyof Pick<typeof ERC20, 'symbol' | 'decimals'>;
  fieldName: string;
  address?: string;
  isOffline: boolean;
  userInputValidator(input: string): Result<string>;
  fetchedFieldValidator?(input: any): Result<string>;
  shouldEnableAutoField(input: Result<string>): boolean;
  onChange(symbol: Result<string>): void;
}

interface State {
  field: Result<string>;
  autoField: boolean;
  userInput: string;
  addressToLoad?: string;
  loading: boolean;
}

export class FieldInput extends React.Component<OwnProps, State> {
  public static getDerivedStateFromProps(
    nextProps: OwnProps,
    prevState: State
  ): Partial<State> | null {
    if (
      !nextProps.isOffline &&
      nextProps.address &&
      nextProps.address !== prevState.addressToLoad
    ) {
      return { loading: true, autoField: true, addressToLoad: nextProps.address };
    }
    return null;
  }

  public state: State = {
    userInput: '',
    autoField: true,
    field: Result.from({ res: '' }),
    loading: false
  };

  private currentRequest: Promise<any> | null;

  public componentDidUpdate() {
    if (!this.props.isOffline && this.state.addressToLoad && this.state.loading) {
      this.attemptToLoadField(this.state.addressToLoad);
    }
  }

  public componentWillUnmount() {
    if (this.currentRequest) {
      this.currentRequest = null;
    }
  }

  public render() {
    const { userInput, field, autoField, loading } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">{this.props.fieldName}</div>
        {loading ? (
          <Spinner />
        ) : (
          <Input
            isValid={field.ok()}
            className="input-group-input-small"
            type="text"
            name={this.props.fieldName}
            readOnly={!this.props.isOffline && autoField}
            value={field.ok() ? field.unwrap() : userInput}
            onChange={this.handleFieldChange}
          />
        )}
        {field.err() && <div className="AddCustom-field-error">{field.err()}</div>}
      </label>
    );
  }

  private handleFieldChange = (args: React.FormEvent<HTMLInputElement>) => {
    const userInput = args.currentTarget.value;
    const field = this.props.userInputValidator(userInput);
    this.setState({ userInput, field });
    this.props.onChange(field);
  };

  private attemptToLoadField(address: string) {
    // process request
    this.currentRequest = this.loadField(address)
      // set state on successful request e.g it was not cancelled
      // and then also set our current request to null
      .then(({ [this.props.fieldToFetch]: field }) =>
        this.setState({
          field,
          loading: false,
          autoField: this.props.shouldEnableAutoField(field)
        })
      )
      .catch(e => {
        console.error(e);
        // if the component is unmounted, then dont call set state
        if (!this.currentRequest) {
          return;
        }

        // otherwise it was a failed fetch call
        this.setState({ autoField: false, loading: false });
      })
      .then(() => (this.currentRequest = null));
  }

  private loadField(address: string) {
    const { fieldToFetch } = this.props;
    return shepherdProvider
      .sendCallRequest({ data: ERC20[fieldToFetch].encodeInput(), to: address })
      .then(ERC20[fieldToFetch].decodeOutput as any)
      .then(({ [fieldToFetch]: field }) => {
        let result: Result<string>;
        if (this.props.fetchedFieldValidator) {
          result = this.props.fetchedFieldValidator(field);
        } else {
          result = Result.from({ res: field });
        }

        //
        //
        this.props.onChange(result);
        return { [fieldToFetch]: result };
      });
  }
}
