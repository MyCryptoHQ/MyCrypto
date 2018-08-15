import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { walletSelectors } from 'features/wallet';
import { getNetworkConfig } from 'features/config';
import EquivalentValues from './EquivalentValues';
import AccountInfo from './AccountInfo';
import Promos from './Promos';
import TokenBalances from './TokenBalances';
import { NetworkConfig } from 'shared/types/network';

interface Block {
  name: string;
  content: React.ReactElement<any>;
  disabled?: boolean;
  isFullWidth?: boolean;
}

interface StateProps {
  wallet: AppState['wallet']['inst'];
  network: NetworkConfig;
}

export class BalanceSidebar extends React.Component<StateProps> {
  public render() {
    const { wallet } = this.props;

    if (!wallet) {
      return null;
    }

    const blocks: Block[] = [
      {
        name: 'Account Info',
        content: <AccountInfo wallet={wallet} />
      },
      {
        name: 'Promos',
        isFullWidth: true,
        content: <Promos />
      },
      {
        name: 'Token Balances',
        disabled: this.props.network.id === 'XMR',
        content: <TokenBalances />
      },
      {
        name: 'Equivalent Values',
        disabled: this.props.network.id === 'XMR',
        content: <EquivalentValues />
      }
    ];

    return (
      <aside>
        {blocks.map(block => {
          if (!block.disabled) {
            return (
              <section
                className={`Block ${block.isFullWidth ? 'is-full-width' : ''}`}
                key={block.name}
              >
                {block.content}
              </section>
            );
          }
        })}
      </aside>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  wallet: walletSelectors.getWalletInst(state),
  network: getNetworkConfig(state)
});

export default connect(mapStateToProps)(BalanceSidebar);
