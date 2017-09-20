import * as customTokenActions from 'actions/customTokens';
import { showNotification } from 'actions/notifications';
import { fiatRequestedRates } from 'actions/rates';
import { NetworkConfig } from 'config/data';
import { Ether } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers/index';
import { getNetworkConfig } from 'selectors/config';
import {
  getTokenBalances,
  getWalletInst,
  TokenBalance
} from 'selectors/wallet';
import AccountInfo from './AccountInfo';
import EquivalentValues from './EquivalentValues';
import Promos from './Promos';
import TokenBalances from './TokenBalances/index';

interface Props {
  wallet: IWallet;
  balance: Ether;
  network: NetworkConfig;
  tokenBalances: TokenBalance[];
  rates: { [key: string]: number };
  showNotification: typeof showNotification;
  addCustomToken: typeof customTokenActions.addCustomToken;
  removeCustomToken: typeof customTokenActions.removeCustomToken;
  fiatRequestedRates: typeof fiatRequestedRates;
}

export class BalanceSidebar extends React.Component<Props, {}> {
  public render() {
    const {
      wallet,
      balance,
      network,
      tokenBalances,
      rates,
      fiatRequestedRates
    } = this.props;
    if (!wallet) {
      return null;
    }

    const blocks = [
      {
        name: 'Account Info',
        content: (
          <AccountInfo
            wallet={wallet}
            balance={balance}
            network={network}
            fiatRequestedRates={fiatRequestedRates}
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
        content: <EquivalentValues balance={balance} rates={rates} />
      }
    ];

    return (
      <aside>
        {blocks.map(block =>
          <section
            className={`Block ${block.isFullWidth ? 'is-full-width' : ''}`}
            key={block.name}
          >
            {block.content}
          </section>
        )}
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
    rates: state.rates
  };
}

export default connect(mapStateToProps, {
  ...customTokenActions,
  showNotification,
  fiatRequestedRates
})(BalanceSidebar);
