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
import OfflineToggle from './OfflineToggle';

interface Props {
  wallet: IWallet;
  balance: Balance;
  network: NetworkConfig;
  tokenBalances: TokenBalance[];
  rates: AppState['rates']['rates'];
  ratesError: AppState['rates']['ratesError'];
  fetchCCRates: TFetchCCRates;
}

interface Block {
  name: string;
  content: React.ReactElement<any>;
  isFullWidth?: boolean;
}

export class BalanceSidebar extends React.Component<Props, {}> {
  public render() {
    const { wallet, balance, network, tokenBalances, rates, ratesError } = this.props;

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
        content: <TokenBalances />
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
}

function mapStateToProps(state: AppState) {
  return {
    wallet: getWalletInst(state),
    balance: state.wallet.balance,
    tokenBalances: getShownTokenBalances(state, true),
    network: getNetworkConfig(state),
    rates: state.rates.rates,
    ratesError: state.rates.ratesError
  };
}

export default connect(mapStateToProps, {
  fetchCCRates
})(BalanceSidebar);
