import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { Token } from 'types/network';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { configSelectors, configMetaSelectors } from 'features/config';
import { customTokensActions } from 'features/customTokens';
import { walletTypes, walletActions, walletSelectors } from 'features/wallet';
import Spinner from 'components/ui/Spinner';
import Balances from './Balances';
import './index.scss';

interface StateProps {
  wallet: AppState['wallet']['inst'];
  walletConfig: AppState['wallet']['config'];
  tokens: Token[];
  tokenBalances: walletTypes.TokenBalance[];
  tokensError: AppState['wallet']['tokensError'];
  isTokensLoading: AppState['wallet']['isTokensLoading'];
  hasSavedWalletTokens: AppState['wallet']['hasSavedWalletTokens'];
  isOffline: AppState['config']['meta']['offline'];
}
interface ActionProps {
  addCustomToken: customTokensActions.TAddCustomToken;
  removeCustomToken: customTokensActions.TRemoveCustomToken;
  scanWalletForTokens: walletActions.TScanWalletForTokens;
  setWalletTokens: walletActions.TSetWalletTokens;
  refreshTokenBalances: walletActions.TRefreshTokenBalances;
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
    wallet: walletSelectors.getWalletInst(state),
    walletConfig: walletSelectors.getWalletConfig(state),
    tokens: configSelectors.getAllTokens(state),
    tokenBalances: selectors.getTokenBalances(state),
    tokensError: state.wallet.tokensError,
    isTokensLoading: state.wallet.isTokensLoading,
    hasSavedWalletTokens: state.wallet.hasSavedWalletTokens,
    isOffline: configMetaSelectors.getOffline(state)
  };
}

export default connect(mapStateToProps, {
  addCustomToken: customTokensActions.addCustomToken,
  removeCustomToken: customTokensActions.removeCustomToken,
  scanWalletForTokens: walletActions.scanWalletForTokens,
  setWalletTokens: walletActions.setWalletTokens,
  refreshTokenBalances: walletActions.refreshTokenBalances
})(TokenBalances);
