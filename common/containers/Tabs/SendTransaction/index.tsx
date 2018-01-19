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
import SubTabs from 'components/SubTabs';

const Send = () => (
  <React.Fragment>
    <Fields />
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  wallet: AppState['wallet']['inst'];
}

type Props = StateProps & RouteComponentProps<{}>;

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, match } = this.props;
    const currentPath = match.url;
    const tabs = [
      {
        path: 'send',
        name: translate('NAV_SendEther'),
        disabled: !!wallet && !!wallet.isReadOnly
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

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader title={translate('Account')} />
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
                      <Redirect
                        from={`${currentPath}`}
                        to={`${wallet.isReadOnly ? currentPath + '/info' : currentPath + '/send'}`}
                      />
                    )}
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
  wallet: getWalletInst(state)
}))(SendTransaction);
