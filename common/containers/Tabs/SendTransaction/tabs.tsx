// LIBS
import React from 'react';
import { Location } from 'history';
// REDUX
import translate from 'translations';
import { Fields, UnavailableWallets, WalletInfo } from './components/index';
import { TResetWallet } from 'actions/wallet';
import { AppState } from 'reducers';

import { Tab } from 'components/SubTabs';

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

const tabs: Tab[] = [
  {
    path: 'send',
    name: translate('NAV_SendEther'),
    isDisabled(props: any): boolean {
      if (props) {
        if (!props.wallet) {
          return true;
        } else {
          return !!props.wallet.isReadOnly;
        }
      }
      return true;
    },
    render() {
      return (
        <div>
          <Fields />
          <UnavailableWallets />
        </div>
      );
    }
  },
  {
    path: 'info',
    name: translate('NAV_ViewWallet'),
    render(props: any) {
      return <div>{props ? props.wallet && <WalletInfo wallet={props.wallet} /> : null}</div>;
    }
  }
];

export default tabs;
