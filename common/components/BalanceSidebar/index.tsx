import {
  addCustomToken,
  removeCustomToken,
  TAddCustomToken,
  TRemoveCustomToken
} from 'actions/customTokens';
import { showNotification, TShowNotification } from 'actions/notifications';
import { fetchCCRates as dFetchCCRates, TFetchCCRates } from 'actions/rates';
import { NetworkConfig } from 'config/data';
import { IWallet, Balance } from 'libs/wallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import {
  getTokenBalances,
  getWalletInst,
  TokenBalance
} from 'selectors/wallet';
import AccountInfo from './AccountInfo';
import EquivalentValues from './EquivalentValues';
import Promos from './Promos';
import TokenBalances from './TokenBalances';
import { State } from 'reducers/rates';
import OfflineToggle from './OfflineToggle';

interface Props {
  wallet: IWallet;
  balance: Balance;
  network: NetworkConfig;
  tokenBalances: TokenBalance[];
  rates: State['rates'];
  ratesError: State['ratesError'];
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
      tokenBalances,
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
        content: (
          <AccountInfo
            wallet={wallet}
            balance={balance}
            network={network}
            fetchCCRates={fetchCCRates}
          />
        )
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
            tokens={tokenBalances}
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
            rates={rates}
            ratesError={ratesError}
          />
        )
      }
    ];

    return (
      <aside>
        {blocks.map(block => (
          <section
            className={`Block ${block.isFullWidth ? 'is-full-width' : ''}`}
            key={block.name}
          >
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
    tokenBalances: getTokenBalances(state),
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
