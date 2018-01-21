import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { UnlockHeader } from 'components/ui';
import { SideBar } from './components';
import { IReadOnlyWallet, IFullWallet } from 'libs/wallet';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import tabs from './tabs';
import SubTabs, { Props as TabProps } from 'components/SubTabs';
import { RouteComponentProps } from 'react-router';
import { NetworkConfig } from 'config';
import { getNetworkConfig } from 'selectors/config';

export type WalletTypes = IReadOnlyWallet | IFullWallet | undefined | null;

interface StateProps {
  wallet: AppState['wallet']['inst'];
  network: AppState['config']['network'];
}

export interface SubTabProps {
  wallet: WalletTypes;
  network: NetworkConfig;
}

type Props = StateProps & RouteComponentProps<{}>;

const determineActiveTab = (wallet: WalletTypes, activeTab: string) => {
  if (wallet && wallet.isReadOnly && (activeTab === 'send' || activeTab === undefined)) {
    return 'info';
  }

  return activeTab;
};

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, location, network } = this.props;
    const activeTab = location.pathname.split('/')[2];

    const tabProps: TabProps<SubTabProps> = {
      root: 'account',
      activeTab: determineActiveTab(wallet, activeTab),
      sideBar: <SideBar />,
      tabs,
      subTabProps: { wallet, network }
    };

    interface IWalletTabs {
      new (): SubTabs<SubTabProps>;
    }

    const WalletTabs = SubTabs as IWalletTabs;

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader title={translate('Account')} />
          {wallet && <WalletTabs {...tabProps} />}
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({
  wallet: getWalletInst(state),
  network: getNetworkConfig(state)
}))(SendTransaction);
