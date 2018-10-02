import React from 'react';
import { RouteComponentProps, Route, Switch, Redirect } from 'react-router';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { walletSelectors } from 'features/wallet';
import TabSection from 'containers/TabSection';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import { UnlockHeader } from 'components/ui';
import SubTabs, { Tab } from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';
import {
  WalletInfo,
  RequestPayment,
  RecentTransactions,
  AddressBook,
  Fields,
  UnavailableWallets,
  SideBar
} from './components';

const Send = () => (
  <React.Fragment>
    <Fields />
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  wallet: AppState['wallet']['inst'];
  requestDisabled: boolean;
}

type Props = StateProps & RouteComponentProps<{}>;

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, match, location, history } = this.props;
    const currentPath = match.url;
    const tabs: Tab[] = [
      {
        path: 'send',
        name: translate('NAV_SENDETHER'),
        disabled: !!wallet && !!wallet.isReadOnly
      },
      {
        path: 'request',
        name: translate('NAV_REQUESTPAYMENT'),
        disabled: this.props.requestDisabled
      },
      {
        path: 'info',
        name: translate('NAV_VIEWWALLET')
      },
      {
        path: 'recent-txs',
        name: translate('NAV_RECENT_TX')
      },
      {
        path: 'address-book',
        name: translate('NAV_ADDRESS_BOOK')
      }
    ];

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader showGenerateLink={true} />
          {wallet && (
            <div className="SubTabs row">
              <div className="col-sm-8">
                <SubTabs tabs={tabs} match={match} location={location} history={history} />
              </div>
              <div className="col-sm-8">
                <Switch>
                  <Route
                    exact={true}
                    path={currentPath}
                    render={() => (
                      <RedirectWithQuery
                        from={`${currentPath}`}
                        to={`${wallet.isReadOnly ? `${currentPath}/info` : `${currentPath}/send`}`}
                      />
                    )}
                  />
                  <Route
                    exact={true}
                    path={`${currentPath}/send`}
                    render={() => {
                      return wallet.isReadOnly ? <Redirect to={`${currentPath}/info`} /> : <Send />;
                    }}
                  />
                  <Route
                    path={`${currentPath}/info`}
                    exact={true}
                    render={() => <WalletInfo wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/request`}
                    exact={true}
                    render={() => <RequestPayment wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/recent-txs`}
                    exact={true}
                    render={() => <RecentTransactions wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/address-book`}
                    exact={true}
                    render={() => <AddressBook />}
                  />
                  <RouteNotFound />
                </Switch>
              </div>
              <SideBar />
            </div>
          )}
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({
  wallet: walletSelectors.getWalletInst(state),
  requestDisabled: !configSelectors.isNetworkUnit(state, 'ETH')
}))(SendTransaction);
