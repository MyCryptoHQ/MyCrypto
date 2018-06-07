import React from 'react';
import AccountInfo from './AccountInfo';
import Promos from './Promos';
import TokenBalances from './TokenBalances';
import { AppState } from 'reducers';
import { getWalletInst } from 'selectors/wallet';
import { connect } from 'react-redux';
import EquivalentValues from './EquivalentValues';
import { getNetworkConfig } from 'selectors/config';
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
  wallet: getWalletInst(state),
  network: getNetworkConfig(state)
});

export default connect(mapStateToProps)(BalanceSidebar);
