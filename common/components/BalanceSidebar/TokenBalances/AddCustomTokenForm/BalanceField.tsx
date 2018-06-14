import React from 'react';
import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import ERC20 from 'libs/erc20';
import { shepherdProvider } from 'libs/nodes';
import { Result } from 'mycrypto-nano-result';
import { getWalletInst } from 'selectors/wallet';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface OwnProps {
  address?: string;
}

interface StateProps {
  walletInst: ReturnType<typeof getWalletInst>;
}

interface State {
  balance: Result<string>;
  addressToLoad?: string;
  loading: boolean;
}

type Props = OwnProps & StateProps;

class BalanceFieldClass extends React.Component<Props, State> {
  public static getDerivedStateFromProps(
    nextProps: OwnProps,
    prevState: State
  ): Partial<State> | null {
    if (nextProps.address && nextProps.address !== prevState.addressToLoad) {
      return { loading: true, addressToLoad: nextProps.address };
    }
    return null;
  }

  public state: State = {
    balance: Result.from({ res: '' }),
    loading: false
  };

  private currentRequest: Promise<any> | null;

  public componentDidUpdate() {
    if (this.state.addressToLoad && this.state.loading) {
      this.attemptToLoadBalance(this.state.addressToLoad);
    }
  }

  public componentWillUnmount() {
    if (this.currentRequest) {
      this.currentRequest = null;
    }
  }
  public render() {
    const { balance, loading } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">Balance</div>
        {loading ? (
          <Spinner />
        ) : (
          <Input
            isValid={balance.ok()}
            className="input-group-input-small"
            type="text"
            name="Balance"
            readOnly={true}
            value={balance.ok() ? balance.unwrap() : '0'}
          />
        )}
        {balance.err() && <div className="AddCustom-field-error">{balance.err()}</div>}
      </label>
    );
  }

  private attemptToLoadBalance(address: string) {
    // process request
    this.currentRequest = this.loadBalance(address)
      // set state on successful request e.g it was not cancelled
      // and then also set our current request to null
      .then(({ balance }) =>
        this.setState({
          balance,
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
        this.setState({ loading: false });
      })
      .then(() => (this.currentRequest = null));
  }

  private loadBalance(address: string) {
    if (!this.props.walletInst) {
      return Promise.reject('No wallet found');
    }

    const owner = this.props.walletInst.getAddressString();
    return shepherdProvider
      .sendCallRequest({ data: ERC20.balanceOf.encodeInput({ _owner: owner }), to: address })
      .then(ERC20.balanceOf.decodeOutput)
      .then(({ balance }) => {
        const result = Result.from({ res: balance });
        return { balance: result };
      });
  }
}

function mapStateToProps(state: AppState): StateProps {
  return { walletInst: getWalletInst(state) };
}

export const BalanceField = connect(mapStateToProps)(BalanceFieldClass);
