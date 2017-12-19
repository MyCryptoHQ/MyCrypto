import TabSection from 'containers/TabSection';
import { OfflineAwareUnlockHeader } from 'components';
import React from 'react';
import { Location } from 'history';
import { connect } from 'react-redux';
import { SideBar } from './components/index';
import { IReadOnlyWallet, IFullWallet } from 'libs/wallet';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import tabs from './tabs';
import SubTabs, { Props as TabProps } from 'components/SubTabs';

interface StateProps {
  location: Location;
  wallet: AppState['wallet']['inst'];
}

export interface SubTabProps {
  wallet: WalletTypes;
}

export type WalletTypes = IReadOnlyWallet | IFullWallet | undefined | null;

class SendTransaction extends React.Component<StateProps> {
  public render() {
    const { wallet } = this.props;
    const activeTab = this.props.location.pathname.split('/')[2];

    const tabProps: TabProps<SubTabProps> = {
      root: 'account',
      activeTab: wallet ? (wallet.isReadOnly ? 'info' : activeTab) : activeTab,
      sideBar: <SideBar />,
      tabs,
      subTabProps: { wallet }
    };

    interface IWalletTabs {
      new (): SubTabs<SubTabProps>;
    }

    const WalletTabs = SubTabs as IWalletTabs;

    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader allowReadOnly={true} />
          {wallet && <WalletTabs {...tabProps} />}
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({ wallet: getWalletInst(state) }))(SendTransaction);
