// COMPONENTS
import TabSection from 'containers/TabSection';
import { SubTabs, OfflineAwareUnlockHeader } from './components';
import NavigationPrompt from './components/NavigationPrompt';
// LIBS
import React from 'react';
// REDUX
import { connect } from 'react-redux';
import { resetWallet } from 'actions/wallet';
import { Wallet } from 'components/renderCbs';

import { initialState, Props, State } from './typings';

export class SendTransaction extends React.Component<Props, State> {
  public state: State = initialState;

  public render() {
    const activeTab = this.props.location.pathname.split('/')[2];

    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader />
          <Wallet
            withWallet={({ wallet }) => (
              <div>
                {wallet.inst && <SubTabs wallet={wallet.inst} activeTab={activeTab} />}
                <NavigationPrompt when={!!wallet.inst} onConfirm={this.props.resetWallet} />
              </div>
            )}
          />
        </section>
      </TabSection>
    );
  }
}

export default connect(null, {
  resetWallet
})(SendTransaction);
