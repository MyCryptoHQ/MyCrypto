import React from 'react';
import { RouteComponentProps, Route, Switch, Redirect } from 'react-router';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { walletSelectors } from 'features/wallet';
import TabSection from 'containers/TabSection';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import { UnlockHeader } from 'components/ui';
import {
  WalletInfo,
  RequestPayment,
  RecentTransactions,
  AddressBook,
  UnavailableWallets,
  SideBar
} from './components';
import { ETHFields, XMRFields } from './components/Fields';
import SubTabs, { Tab } from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';
import { getNetworkConfig, isNetworkUnit } from 'features/config';
import { NetworkConfig } from 'shared/types/network';
import { Recieve } from './components/Recieve';

const Send = (props: any) => (
  <React.Fragment>
    {props.network.id === 'XMR' ? <XMRFields /> : <ETHFields />}
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  wallet: AppState['wallet']['inst'];
  requestDisabled: boolean;
  network: NetworkConfig;
}

type Props = StateProps & RouteComponentProps<{}>;

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, match, location, history, network } = this.props;
    const currentPath = match.url;
    const ETHtabs: Tab[] = [
      {
        path: 'send',
        name: translate('NAV_SENDETHER'),
        disabled: !!wallet && !!wallet.isReadOnly
      },
      {
        path: 'receive',
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
    const XMRtabs: Tab[] = [
      {
        path: 'send',
        name: translate('NAV_SENDETHER'),
        disabled: !!wallet && !!wallet.isReadOnly
      },
      {
        path: 'receive',
        name: translate('NAV_REQUESTPAYMENT')
      }
    ];

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader showGenerateLink={true} />
          {wallet && (
            <div className="SubTabs row">
              <div className="col-sm-8">
                <SubTabs
                  tabs={network.id === 'XMR' ? XMRtabs : ETHtabs}
                  match={match}
                  location={location}
                  history={history}
                />
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
                      return wallet.isReadOnly ? (
                        <Redirect to={`${currentPath}/info`} />
                      ) : (
                        <Send network={this.props.network} />
                      );
                    }}
                  />
                  <Route
                    path={`${currentPath}/info`}
                    exact={true}
                    render={() => <WalletInfo wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/receive`}
                    exact={true}
                    render={() =>
                      network.id === 'XMR' ? <Recieve /> : <RequestPayment wallet={wallet} />
                    }
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

const mapStateToProps = (state: AppState) => ({
  wallet: walletSelectors.getWalletInst(state),
  requestDisabled: !isNetworkUnit(state, 'ETH'),
  network: getNetworkConfig(state)
});

export default connect(mapStateToProps)(SendTransaction);
