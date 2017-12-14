// COMPONENTS
import TabSection from 'containers/TabSection';
import SubTabs from 'components/SubTabs';
import NavigationPrompt from './components/NavigationPrompt';
import { OfflineAwareUnlockHeader } from 'components';
// LIBS
import React from 'react';
import { Location } from 'history';
// REDUX
import { connect } from 'react-redux';
import { SideBar } from './components/index';

import { resetWallet, TResetWallet } from 'actions/wallet';
// UTILS
//import { formatGasLimit } from 'utils/formatters';

import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
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

export type Props = StateProps & DispatchProps;

export const initialState: State = {
  generateDisabled: true,
  generateTxProcessing: false
};

export class SendTransaction extends React.Component<Props, State> {
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
          <OfflineAwareUnlockHeader />

          {wallet && <SubTabs {...subTabsProps} />}

          <NavigationPrompt when={!!wallet} onConfirm={this.props.resetWallet} />
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({ wallet: getWalletInst(state) }), {
  resetWallet
})(SendTransaction);
