import {
  addCustomToken,
  removeCustomToken,
  TAddCustomToken,
  TRemoveCustomToken
} from 'actions/customTokens';
import { showNotification, TShowNotification } from 'actions/notifications';
import { fetchCCRates as dFetchCCRates, TFetchCCRates } from 'actions/rates';
import { NetworkConfig, Token } from 'config/data';
import { IWallet, Balance } from 'libs/wallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig, getAllTokens } from 'selectors/config';
import { getTokenBalances, getWalletInst, TokenBalance } from 'selectors/wallet';
import AccountInfo from './AccountInfo';
import EquivalentValues from './EquivalentValues';
import Promos from './Promos';
import TokenBalances from './TokenBalances';
import OfflineToggle from './OfflineToggle';

interface Props {
  wallet: IWallet;
  balance: Balance;
  network: NetworkConfig;
  tokens: Token[];
  tokenBalances: TokenBalance[];
  tokensError: AppState['wallet']['tokensError'];
  isTokensLoading: AppState['wallet']['isTokensLoading'];
  rates: AppState['rates']['rates'];
  ratesError: AppState['rates']['ratesError'];
  showNotification: TShowNotification;
  addCustomToken: TAddCustomToken;
  removeCustomToken: TRemoveCustomToken;
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
      balance,
      network,
      tokens,
      tokenBalances,
      tokensError,
      isTokensLoading,
      rates,
      ratesError,
      fetchCCRates
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
            tokenBalances={tokenBalances}
            tokensError={tokensError}
            isTokensLoading={isTokensLoading}
            onAddCustomToken={this.props.addCustomToken}
            onRemoveCustomToken={this.props.removeCustomToken}
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
            fetchCCRates={fetchCCRates}
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
}

function mapStateToProps(state: AppState) {
  return {
    wallet: getWalletInst(state),
    balance: state.wallet.balance,
    tokens: getAllTokens(state),
    tokenBalances: getTokenBalances(state),
    tokensError: state.wallet.tokensError,
    isTokensLoading: state.wallet.isTokensLoading,
    network: getNetworkConfig(state),
    rates: state.rates.rates,
    ratesError: state.rates.ratesError
  };
}

export default connect(mapStateToProps, {
  addCustomToken,
  removeCustomToken,
  showNotification,
  fetchCCRates: dFetchCCRates
})(BalanceSidebar);
