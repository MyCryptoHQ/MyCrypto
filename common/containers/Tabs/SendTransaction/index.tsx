import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { UnlockHeader } from 'components/ui';
import { SideBar } from './components/index';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps, Route, Switch, Redirect } from 'react-router';
import {
  WalletInfo,
  RequestPayment,
  Fields,
  UnavailableWallets
} from 'containers/Tabs/SendTransaction/components';
import { NavLink } from 'react-router-dom';
import './SendTransaction.scss';

const Send = () => (
  <React.Fragment>
    <Fields />
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  wallet: AppState['wallet']['inst'];
  network: AppState['config']['network'];
}

type Props = StateProps & RouteComponentProps<{}>;

const tabs = [
  {
    path: 'send',
    name: translate('NAV_SendEther')
  },
  {
    path: 'request',
    name: translate('Request Payment')
  },
  {
    path: 'info',
    name: translate('NAV_ViewWallet')
  }
];

class SendTransaction extends React.Component<Props> {
  public render() {
    const currentPath = this.props.match.url;
    const { wallet } = this.props;

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader title={translate('Account')} />
          {wallet && (
            <div className="SubTabs row">
              <div className="SubTabs-tabs col-sm-8">
                {tabs.map((t, i) => (
                  // Same as normal Link, but knows when it's active, and applies activeClassName
                  <NavLink
                    className="SubTabs-tabs-link"
                    activeClassName="is-active"
                    to={currentPath + '/' + t.path}
                    key={i}
                  >
                    {t.name}
                  </NavLink>
                ))}
              </div>

              <main className="SubTabs-tabs col-sm-8">
                <Switch>
                  <Route
                    exact={true}
                    path={currentPath}
                    render={() => <Redirect from={`${currentPath}`} to={`${currentPath}/send`} />}
                  />
                  <Route path={`${currentPath}/send`} component={Send} />
                  <Route
                    path={`${currentPath}/info`}
                    render={() => <WalletInfo wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/request`}
                    render={() => <RequestPayment wallet={wallet} />}
                  />
                </Switch>
              </main>
              <SideBar />
            </div>
          )}
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({
  wallet: getWalletInst(state),
  network: getNetworkConfig(state)
}))(SendTransaction);
