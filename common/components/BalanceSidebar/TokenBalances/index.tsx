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
  TSetWalletTokens,
  refreshTokenBalances,
  TRefreshTokenBalances
} from 'actions/wallet';
import { getAllTokens, getOffline } from 'selectors/config';
import { getTokenBalances, getWalletInst, getWalletConfig, TokenBalance } from 'selectors/wallet';
import translate from 'translations';
import Balances from './Balances';
import Spinner from 'components/ui/Spinner';
import { Token } from 'types/network';
import './index.scss';

interface StateProps {
  wallet: AppState['wallet']['inst'];
  walletConfig: AppState['wallet']['config'];
  tokens: Token[];
  tokenBalances: TokenBalance[];
  tokensError: AppState['wallet']['tokensError'];
  isTokensLoading: AppState['wallet']['isTokensLoading'];
  hasSavedWalletTokens: AppState['wallet']['hasSavedWalletTokens'];
  isOffline: AppState['config']['meta']['offline'];
}
interface ActionProps {
  addCustomToken: TAddCustomToken;
  removeCustomToken: TRemoveCustomToken;
  scanWalletForTokens: TScanWalletForTokens;
  setWalletTokens: TSetWalletTokens;
  refreshTokenBalances: TRefreshTokenBalances;
}
type Props = StateProps & ActionProps;

class TokenBalances extends React.Component<Props> {
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

    const walletTokens = walletConfig ? walletConfig.tokens : [];

    let content;
    if (isOffline) {
      content = (
        <div className="TokenBalances-offline well well-sm">{translate('SCAN_TOKENS_OFFLINE')}</div>
      );
    } else if (tokensError) {
      content = (
        <div className="TokenBalances-error well well-md">
          <h5 className="TokenBalances-error-message">{tokensError}</h5>
          <button onClick={this.props.refreshTokenBalances} className="btn btn-default btn-sm">
            {translate('X_TRY_AGAIN')}
            <i className="fa fa-refresh" />
          </button>
        </div>
      );
    } else if (isTokensLoading) {
      content = (
        <div className="TokenBalances-loader">
          <Spinner size="x3" />
        </div>
      );
    } else if (!walletTokens) {
      content = (
        <button
          className="TokenBalances-scan btn btn-primary btn-block"
          onClick={this.scanWalletForTokens}
        >
          {translate('SCAN_TOKENS')}
        </button>
      );
    } else {
      const shownBalances = tokenBalances.filter(t => walletTokens.includes(t.symbol));

      content = (
        <Balances
          allTokens={tokens}
          tokenBalances={shownBalances}
          hasSavedWalletTokens={hasSavedWalletTokens}
          scanWalletForTokens={this.scanWalletForTokens}
          setWalletTokens={this.props.setWalletTokens}
          onAddCustomToken={this.props.addCustomToken}
          onRemoveCustomToken={this.props.removeCustomToken}
        />
      );
    }

    return (
      <section className="TokenBalances">
        <h5 className="TokenBalances-title">{translate('SIDEBAR_TOKENBAL')}</h5>
        {content}
      </section>
    );
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
    isOffline: getOffline(state)
  };
}

export default connect(mapStateToProps, {
  addCustomToken,
  removeCustomToken,
  scanWalletForTokens,
  setWalletTokens,
  refreshTokenBalances
})(TokenBalances);
