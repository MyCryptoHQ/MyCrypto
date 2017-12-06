import React from 'react';
import classnames from 'classnames';
import translate from 'translations';
import { Link } from 'react-router-dom';
import { Fields, UnavailableWallets, WalletInfo, SideBar } from './index';
import { IWallet } from 'libs/wallet';
import './SubTabs.scss';

interface Props {
  wallet: IWallet;
  activeTab: string;
}

const TABS = [
  {
    path: 'send',
    name: translate('NAV_SendEther'),
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
    render(props: Props) {
      return <WalletInfo wallet={props.wallet} />;
    }
  }
];

export default class SubTabs extends React.Component<Props, {}> {
  public render() {
    const { activeTab } = this.props;
    const tab = TABS.find(t => t.path === activeTab) || TABS[0];

    return (
      <div className="SubTabs row">
        <div className="SubTabs-tabs col-sm-8">
          {TABS.map(t => (
            <Link
              className={classnames({
                'SubTabs-tabs-link': true,
                'is-active': t.path === activeTab
              })}
              to={`/account/${t.path}`}
              key={t.path}
            >
              {t.name}
            </Link>
          ))}
        </div>

        <main className="SubTabs-content col-sm-8" key={tab.path}>
          {tab.render(this.props)}
        </main>
        <SideBar />
      </div>
    );
  }
}
