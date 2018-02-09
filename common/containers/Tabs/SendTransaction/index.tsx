import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { UnlockHeader } from 'components/ui';
import { SideBar } from './components/index';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps, Route, Switch } from 'react-router';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import {
  WalletInfo,
  RequestPayment,
  Fields,
  UnavailableWallets
} from 'containers/Tabs/SendTransaction/components';
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
    const { wallet, match } = this.props;
    const currentPath = match.url;
    const tabs: Tab[] = [
      {
        path: 'send',
        name: translate('NAV_SendEther'),
        disabled: !!wallet && !!wallet.isReadOnly
      },
      {
        path: 'request',
        name: translate('Request Payment'),
        disabled: this.props.requestDisabled
      },
      {
        path: 'info',
        name: translate('NAV_ViewWallet')
      }
    ];

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader title={translate('Account')} showGenerateLink={true} />
          {wallet && (
            <div className="SubTabs row">
              <div className="col-sm-8">
                <SubTabs tabs={tabs} match={match} />
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
                  <Route exact={true} path={`${currentPath}/send`} component={Send} />
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
  wallet: getWalletInst(state),
  requestDisabled: !isNetworkUnit(state, 'ETH')
}))(SendTransaction);
