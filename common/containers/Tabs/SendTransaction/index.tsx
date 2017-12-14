// COMPONENTS
import TabSection from 'containers/TabSection';
import { SubTabs } from './components';
import NavigationPrompt from './components/NavigationPrompt';
import { OfflineAwareUnlockHeader } from 'components';
// LIBS
import React from 'react';
import { Location } from 'history';
// REDUX
import { connect } from 'react-redux';
import { resetWallet, TResetWallet } from 'actions/wallet';
// UTILS
//import { formatGasLimit } from 'utils/formatters';

import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';

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

    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader />

          {wallet && <SubTabs wallet={wallet} activeTab={wallet.isReadOnly ? 'info' : activeTab} />}

          <NavigationPrompt when={!!wallet} onConfirm={this.props.resetWallet} />
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({ wallet: getWalletInst(state) }), {
  resetWallet
})(SendTransaction);
