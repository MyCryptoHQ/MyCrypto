import {
  addCustomToken,
  removeCustomToken,
  TAddCustomToken,
  TRemoveCustomToken
} from 'actions/customTokens';
import { showNotification, TShowNotification } from 'actions/notifications';
import {
  fiatRequestedRates as dFiatRequestedRates,
  TFiatRequestedRates
} from 'actions/rates';
import { NetworkConfig } from 'config/data';
import { Ether } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
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

interface Props {
  wallet: IWallet;
  balance: Ether;
  network: NetworkConfig;
  tokenBalances: TokenBalance[];
  rates: { [key: string]: number };
  showNotification: TShowNotification;
  addCustomToken: TAddCustomToken;
  removeCustomToken: TRemoveCustomToken;
  fiatRequestedRates: TFiatRequestedRates;
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
      fiatRequestedRates
    } = this.props;
    if (!wallet) {
      return null;
    }

    const blocks: Block[] = [
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
  addCustomToken,
  removeCustomToken,
  showNotification,
  fiatRequestedRates: dFiatRequestedRates
})(BalanceSidebar);
