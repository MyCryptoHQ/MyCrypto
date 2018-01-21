// LIBS
import React from 'react';
// REDUX
import translate from 'translations';
import { Fields, UnavailableWallets, WalletInfo, RequestPayment } from './components/index';
import { Tab } from 'components/SubTabs';
import { SubTabProps } from 'containers/Tabs/SendTransaction';
import { isNetworkUnit } from 'utils/network';

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

const RequestTab: Tab<SubTabProps> = {
  path: 'request',
  name: translate('Request Payment'),
  isDisabled: (props: SubTabProps) => {
    const isETHNetwork = isNetworkUnit(props.network, 'ETH');
    return !isETHNetwork;
  },
  render(props: SubTabProps) {
    const content = props && props.wallet ? <RequestPayment wallet={props.wallet} /> : null;
    return <div>{content}</div>;
  }
};

const tabs: Tab<SubTabProps>[] = [SendTab, RequestTab, InfoTab];

export default tabs;
