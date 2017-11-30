// COMPONENTS
import Spinner from 'components/ui/Spinner';
import TabSection from 'containers/TabSection';
import {
  Fields,
  UnavailableWallets,
  SideBar,
  OfflineAwareUnlockHeader
} from './components';
import NavigationPrompt from './components/NavigationPrompt';
// LIBS
import React from 'react';
// REDUX
import { connect } from 'react-redux';
import { resetWallet } from 'actions/wallet';
import { Wallet } from 'components/renderCbs';
// UTILS
//import { formatGasLimit } from 'utils/formatters';

import { initialState, Props, State } from './typings';

export class SendTransaction extends React.Component<Props, State> {
  public state: State = initialState;

  public render() {
    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader />
          <Wallet
            withWallet={({ wallet }) => (
              <NavigationPrompt
                when={!!wallet.inst}
                onConfirm={this.props.resetWallet}
              />
            )}
          />

          <div className="row">
            {/* Send Form */}
            <Fields />
            <UnavailableWallets />
            <SideBar />
          </div>
        </section>
      </TabSection>
    );
  }
}

export default connect(null, {
  resetWallet
})(SendTransaction);
