import {
  addCustomToken,
  removeCustomToken,
  TAddCustomToken,
  TRemoveCustomToken
} from 'actions/customTokens';
import { showNotification, TShowNotification } from 'actions/notifications';
import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import {
  scanWalletForTokens,
  TScanWalletForTokens,
  setWalletTokens,
  TSetWalletTokens
} from 'actions/wallet';
import { NetworkConfig, Token } from 'config/data';
import { IWallet, Balance, WalletConfig } from 'libs/wallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig, getAllTokens } from 'selectors/config';
import { getTokenBalances, getWalletInst, getWalletConfig, TokenBalance } from 'selectors/wallet';
import AccountInfo from './AccountInfo';
import EquivalentValues from './EquivalentValues';
import Promos from './Promos';
import TokenBalances from './TokenBalances';
import OfflineToggle from './OfflineToggle';

interface Props {
  wallet: IWallet;
  walletConfig: WalletConfig;
  balance: Balance;
  network: NetworkConfig;
  tokens: Token[];
  tokenBalances: TokenBalance[];
  tokensError: AppState['wallet']['tokensError'];
  isTokensLoading: AppState['wallet']['isTokensLoading'];
  hasSavedWalletTokens: AppState['wallet']['hasSavedWalletTokens'];
  rates: AppState['rates']['rates'];
  ratesError: AppState['rates']['ratesError'];
  showNotification: TShowNotification;
  addCustomToken: TAddCustomToken;
  removeCustomToken: TRemoveCustomToken;
  scanWalletForTokens: TScanWalletForTokens;
  setWalletTokens: TSetWalletTokens;
  fetchCCRates: TFetchCCRates;
}

interface Block {
  name: string;
  content: React.ReactElement<any>;
  isFullWidth?: boolean;
}

export class BalanceSidebar extends React.Component<Props, {}> {
  public render() {
    const {
      wallet,
      walletConfig,
      balance,
      network,
      tokens,
      tokenBalances,
      tokensError,
      isTokensLoading,
      hasSavedWalletTokens,
      rates,
      ratesError
    } = this.props;

    if (!wallet) {
      return null;
    }

    const blocks: Block[] = [
      {
        name: 'Go Offline',
        content: <OfflineToggle />
      },
      {
        name: 'Account Info',
        content: <AccountInfo wallet={wallet} balance={balance} network={network} />
      },
      {
        name: 'Promos',
        isFullWidth: true,
        content: <Promos />
      },
      {
        name: 'Token Balances',
        content: (
          <TokenBalances
            tokens={tokens}
            walletTokens={(walletConfig && walletConfig.tokens) || null}
            tokenBalances={tokenBalances}
            tokensError={tokensError}
            isTokensLoading={isTokensLoading}
            hasSavedWalletTokens={hasSavedWalletTokens}
            onAddCustomToken={this.props.addCustomToken}
            onRemoveCustomToken={this.props.removeCustomToken}
            scanWalletForTokens={this.scanWalletForTokens}
            setWalletTokens={this.props.setWalletTokens}
          />
        )
      },
      {
        name: 'Equivalent Values',
        content: (
          <EquivalentValues
            balance={balance}
            tokenBalances={tokenBalances}
            rates={rates}
            ratesError={ratesError}
            fetchCCRates={this.props.fetchCCRates}
          />
        )
      }
    ];

    return (
      <aside>
        {blocks.map(block => (
          <section className={`Block ${block.isFullWidth ? 'is-full-width' : ''}`} key={block.name}>
            {block.content}
          </section>
        ))}
      </aside>
    );
  }

  private scanWalletForTokens = () => {
    if (this.props.wallet) {
      this.props.scanWalletForTokens(this.props.wallet);
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: getWalletInst(state),
    walletConfig: getWalletConfig(state),
    balance: state.wallet.balance,
    tokens: getAllTokens(state),
    tokenBalances: getTokenBalances(state),
    tokensError: state.wallet.tokensError,
    isTokensLoading: state.wallet.isTokensLoading,
    hasSavedWalletTokens: state.wallet.hasSavedWalletTokens,
    network: getNetworkConfig(state),
    rates: state.rates.rates,
    ratesError: state.rates.ratesError
  };
}

export default connect(mapStateToProps, {
  addCustomToken,
  removeCustomToken,
  showNotification,
  scanWalletForTokens,
  setWalletTokens,
  fetchCCRates
})(BalanceSidebar);
