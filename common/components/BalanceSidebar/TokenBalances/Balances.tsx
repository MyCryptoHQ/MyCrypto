import React from 'react';
import translate from 'translations';
import { TokenBalance } from 'selectors/wallet';
import AddCustomTokenForm from './AddCustomTokenForm';
import TokenRow from './TokenRow';
import { Token, NetworkConfig } from 'types/network';
import { connect } from 'react-redux';
import { getNetworkConfig } from 'selectors/config';
import { AppState } from 'reducers';

interface Props {
  allTokens: Token[];
  tokenBalances: TokenBalance[];
  hasSavedWalletTokens: boolean;
  scanWalletForTokens(): any;
  setWalletTokens(tokens: string[]): any;
  onAddCustomToken(token: Token): any;
  onRemoveCustomToken(symbol: string): any;
}

interface StateProps {
  network: NetworkConfig;
}

type AllProps = Props & StateProps;

interface TrackedTokens {
  [symbol: string]: boolean;
}

interface State {
  trackedTokens: { [symbol: string]: boolean };
  showCustomTokenForm: boolean;
}
export default class TokenBalances extends React.PureComponent<AllProps, State> {
  public state: State = {
    trackedTokens: {},
    showCustomTokenForm: false
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tokenBalances !== this.props.tokenBalances) {
      const trackedTokens = nextProps.tokenBalances.reduce<TrackedTokens>((prev, t) => {
        prev[t.symbol] = !t.balance.isZero();
        return prev;
      }, {});
      this.setState({ trackedTokens });
    }
  }

  public render() {
    const { allTokens, tokenBalances, hasSavedWalletTokens } = this.props;
    const { showCustomTokenForm, trackedTokens } = this.state;

    let bottom;
    let help;
    if (tokenBalances.length && !hasSavedWalletTokens) {
      help = 'Select which tokens you would like to keep track of';
      bottom = (
        <div className="TokenBalances-buttons">
          <button
            className="TokenBalances-buttons-btn btn btn-primary btn-block"
            onClick={this.handleSetWalletTokens}
          >
            <span>{translate('X_SAVE')}</span>
          </button>
          <p className="TokenBalances-buttons-help">{translate('PROMPT_ADD_CUSTOM_TKN')}</p>
        </div>
      );
    } else if (showCustomTokenForm) {
      bottom = (
        <div className="TokenBalances-form">
          <AddCustomTokenForm
            allTokens={allTokens}
            onSave={this.addCustomToken}
            toggleForm={this.toggleShowCustomTokenForm}
          />
        </div>
      );
    } else {
      bottom = (
        <div className="TokenBalances-buttons">
          <button
            className="TokenBalances-buttons-btn btn btn-default btn-xs"
            onClick={this.toggleShowCustomTokenForm}
          >
            <span>{translate('SEND_CUSTOM')}</span>
          </button>
          <button
            className="TokenBalances-buttons-btn btn btn-default btn-xs"
            onClick={this.props.scanWalletForTokens}
          >
            <span>{translate('SCAN_TOKENS')}</span>
          </button>
        </div>
      );
    }

    return (
      <div>
        {help && <p className="TokenBalances-help">{help}</p>}

        {tokenBalances.length ? (
          <table className="TokenBalances-rows">
            <tbody>
              {tokenBalances.map(
                token =>
                  token ? (
                    <TokenRow
                      key={token.symbol}
                      balance={token.balance}
                      symbol={token.symbol}
                      custom={token.custom}
                      decimal={token.decimal}
                      tracked={trackedTokens[token.symbol]}
                      toggleTracked={!hasSavedWalletTokens && this.toggleTrack}
                      onRemove={this.props.onRemoveCustomToken}
                    />
                  ) : null
              )}
            </tbody>
          </table>
        ) : (
          <div className="well well-sm text-center">{translate('SCAN_TOKENS_FAIL_NO_TOKENS')}</div>
        )}
        {bottom}
      </div>
    );
  }

  private toggleTrack = (symbol: string) => {
    this.setState({
      trackedTokens: {
        ...this.state.trackedTokens,
        [symbol]: !this.state.trackedTokens[symbol]
      }
    });
  };

  private toggleShowCustomTokenForm = () => {
    this.setState({
      showCustomTokenForm: !this.state.showCustomTokenForm
    });
  };

  private addCustomToken = (token: Token) => {
    this.props.onAddCustomToken(token);
    this.setState({ showCustomTokenForm: false });
  };

  private handleSetWalletTokens = () => {
    const { trackedTokens } = this.state;
    const desiredTokens = Object.keys(trackedTokens).filter(t => trackedTokens[t]);
    this.props.setWalletTokens(desiredTokens);
  };
}

const mapStateToProps = (state: AppState): StateProps => {
  return {
    network: getNetworkConfig(state)
  };
};

export const balance = connect<StateProps>(mapStateToProps)(TokenBalances);
