import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  addCustomToken,
  removeCustomToken,
  TAddCustomToken,
  TRemoveCustomToken
} from 'actions/customTokens';
import {
  scanWalletForTokens,
  TScanWalletForTokens,
  setWalletTokens,
  TSetWalletTokens
} from 'actions/wallet';
import { getAllTokens } from 'selectors/config';
import { AddressField, GasSlider } from 'components';
import { getTokenBalances, getWalletInst, getWalletConfig, TokenBalance } from 'selectors/wallet';
import { Token } from 'config/data';
import translate from 'translations';
import Balances from 'components/BalanceSidebar/TokenBalances/Balances';
import Spinner from 'components/ui/Spinner';
// import './index.scss';

interface StateProps {
  wallet: AppState['wallet']['inst'];
  walletConfig: AppState['wallet']['config'];
  tokens: Token[];
  tokenBalances: TokenBalance[];
  tokensError: AppState['wallet']['tokensError'];
  isTokensLoading: AppState['wallet']['isTokensLoading'];
  hasSavedWalletTokens: AppState['wallet']['hasSavedWalletTokens'];
  isOffline: AppState['config']['offline'];
}
interface ActionProps {
  addCustomToken: TAddCustomToken;
  removeCustomToken: TRemoveCustomToken;
  scanWalletForTokens: TScanWalletForTokens;
  setWalletTokens: TSetWalletTokens;
}
type Props = StateProps & ActionProps;

interface State {
  hasScanned: boolean;
}

class TokenSweeper extends React.Component<Props, State> {
  public state = {
    hasScanned: false
  };

  public render() {
    const {
      tokens,
      walletConfig,
      tokenBalances,
      hasSavedWalletTokens,
      isTokensLoading,
      tokensError,
      isOffline
    } = this.props;

    const { hasScanned } = this.state;
    let walletTokens;
    let shownBalances;

    walletTokens = walletConfig ? walletConfig.tokens : [''];

    if (walletTokens) {
      shownBalances = tokenBalances.filter(t => walletTokens.includes(t.symbol));
    }

    let content;
    if (isOffline) {
      content = (
        <div className="TokenBalances-offline well well-sm">
          Token balances are unavailable offline
        </div>
      );
    } else if (tokensError) {
      content = <h5>{tokensError}</h5>;
    } else if (isTokensLoading) {
      content = (
        <div className="TokenBalances-loader">
          <Spinner size="x3" />
        </div>
      );
    } else {
      content = (
        <div className="Tab-content-pane">
          <h4>How to transfer all tokens from one wallet to another wallet</h4>
          <ol>
            <li>Enter the address you want to transfer to</li>
            <li>Scan All Tokens</li>
            <li>
              For each token a different transaction broadcast will need to be confirm, So 10 tokens
              will be 10 transactions that need confirmation approval before being sent
            </li>
          </ol>
          <AddressField />

          {!hasScanned && (
            <button
              className="TokenBalances-scan btn btn-primary btn-block"
              onClick={this.scanWalletForTokens}
            >
              {translate('Scan for my Tokens')}
            </button>
          )}

          {hasScanned && (
            <Balances
              allTokens={tokens}
              tokenBalances={shownBalances}
              hasSavedWalletTokens={hasSavedWalletTokens}
              scanWalletForTokens={this.scanWalletForTokens}
              setWalletTokens={this.props.setWalletTokens}
              onAddCustomToken={this.props.addCustomToken}
              onRemoveCustomToken={this.props.removeCustomToken}
            />
          )}

          <div className="row form-group">
            <div className="col-xs-12">
              <GasSlider disableAdvanced={true} />
            </div>
          </div>
        </div>
      );
    }

    return <section className="TokenSweeper">{content}</section>;
  }

  private scanWalletForTokens = () => {
    if (this.props.wallet) {
      this.props.scanWalletForTokens(this.props.wallet);
      this.setState({ hasScanned: true });
    }
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    wallet: getWalletInst(state),
    walletConfig: getWalletConfig(state),
    tokens: getAllTokens(state),
    tokenBalances: getTokenBalances(state),
    tokensError: state.wallet.tokensError,
    isTokensLoading: state.wallet.isTokensLoading,
    hasSavedWalletTokens: state.wallet.hasSavedWalletTokens,
    isOffline: state.config.offline
  };
}

export default connect(mapStateToProps, {
  addCustomToken,
  removeCustomToken,
  scanWalletForTokens,
  setWalletTokens
})(TokenSweeper);
