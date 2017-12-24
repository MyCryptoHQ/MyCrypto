// LIBS
import React from 'react';
// REDUX
import translate from 'translations';
import { Fields, UnavailableWallets, WalletInfo } from './components/index';
import { Tab } from 'components/SubTabs';
import { SubTabProps } from 'containers/Tabs/SendTransaction';

const SendTab: Tab<SubTabProps> = {
  path: 'send',
  name: translate('NAV_SendEther'),
  isDisabled(props: SubTabProps): boolean {
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
};

const InfoTab: Tab<SubTabProps> = {
  path: 'info',
  name: translate('NAV_ViewWallet'),
  render(props: SubTabProps) {
    const content = props && props.wallet ? <WalletInfo wallet={props.wallet} /> : null;
    return <div>{content}</div>;
  }
};
const tabs: Tab<SubTabProps>[] = [SendTab, InfoTab];

export default tabs;
