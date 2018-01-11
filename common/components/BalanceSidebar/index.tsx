import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import { NetworkConfig } from 'config/data';
import { IWallet, Balance } from 'libs/wallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import { getShownTokenBalances, getWalletInst, TokenBalance } from 'selectors/wallet';
import AccountInfo from './AccountInfo';
import EquivalentValues from './EquivalentValues';
import Promos from './Promos';
import TokenBalances from './TokenBalances';

interface Props {
  wallet: IWallet;
  balance: Balance;
  network: NetworkConfig;
  tokenBalances: TokenBalance[];
  rates: AppState['rates']['rates'];
  ratesError: AppState['rates']['ratesError'];
  fetchCCRates: TFetchCCRates;
  isOffline: AppState['config']['offline'];
}

interface Block {
  name: string;
  content: React.ReactElement<any>;
  isFullWidth?: boolean;
}

export class BalanceSidebar extends React.Component<Props, {}> {
  public render() {
    const { wallet, balance, network, tokenBalances, rates, ratesError, isOffline } = this.props;

    if (!wallet) {
      return null;
    }

    const blocks: Block[] = [
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
        content: <TokenBalances />
      },
      {
        name: 'Equivalent Values',
        content: (
          <EquivalentValues
            network={network}
            balance={balance}
            tokenBalances={tokenBalances}
            rates={rates}
            ratesError={ratesError}
            fetchCCRates={this.props.fetchCCRates}
            isOffline={isOffline}
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
    tokenBalances: getShownTokenBalances(state, true),
    network: getNetworkConfig(state),
    rates: state.rates.rates,
    ratesError: state.rates.ratesError,
    isOffline: state.config.offline
  };
}

export default connect(mapStateToProps, {
  fetchCCRates
})(BalanceSidebar);
