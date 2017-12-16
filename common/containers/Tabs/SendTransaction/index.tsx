import TabSection from 'containers/TabSection';
import SubTabs from 'components/SubTabs';
import { OfflineAwareUnlockHeader } from 'components';
import React from 'react';
import { Location } from 'history';
import { connect } from 'react-redux';
import { resetWallet, TResetWallet } from 'actions/wallet';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { SideBar } from './components';
import tabs from './tabs';

interface State {
  generateDisabled: boolean;
  generateTxProcessing: boolean;
}

interface StateProps {
  location: Location;
  wallet: AppState['wallet']['inst'];
}
interface DispatchProps {
  resetWallet: TResetWallet;
}

type Props = StateProps & DispatchProps;

const initialState: State = {
  generateDisabled: true,
  generateTxProcessing: false
};

class SendTransaction extends React.Component<Props, State> {
  public state: State = initialState;

  public render() {
    const { wallet } = this.props;
    const activeTab = this.props.location.pathname.split('/')[2];

    const subTabsProps = {
      root: 'account',
      activeTab: wallet ? (wallet.isReadOnly ? 'info' : activeTab) : activeTab,
      sideBar: <SideBar />,
      tabs,
      wallet
    };
    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader allowReadOnly={true} />
          {wallet && <SubTabs {...subTabsProps} />}
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({ wallet: getWalletInst(state) }), {
  resetWallet
})(SendTransaction);
