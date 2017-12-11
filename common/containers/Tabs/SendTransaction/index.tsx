// COMPONENTS
import TabSection from 'containers/TabSection';
import { Fields, UnavailableWallets, SideBar } from './components';
import NavigationPrompt from './components/NavigationPrompt';
import { OfflineAwareUnlockHeader } from 'components';
// LIBS
import React from 'react';
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
    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader />

          <NavigationPrompt when={!!this.props.wallet} onConfirm={this.props.resetWallet} />

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

export default connect((state: AppState) => ({ wallet: getWalletInst(state) }), {
  resetWallet
})(SendTransaction);
