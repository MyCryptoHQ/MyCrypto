import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import QrSignerModal from 'containers/QrSignerModal';
import { UnlockHeader } from 'components/ui';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps, Route, Switch, Redirect } from 'react-router';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import {
  WalletInfo,
  RequestPayment,
  RecentTransactions,
  Fields,
  UnavailableWallets,
  SideBar
} from './components';
import SubTabs, { Tab } from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';
import { isNetworkUnit } from 'selectors/config/wallet';

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
                  <RouteNotFound />
                </Switch>
              </div>
              <SideBar />
            </div>
          )}
        </section>
        <QrSignerModal />
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({
  wallet: getWalletInst(state),
  requestDisabled: !isNetworkUnit(state, 'ETH')
}))(SendTransaction);
