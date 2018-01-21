import React, { Component } from 'react';
import Keystore from './components/Keystore';
import Mnemonic from './components/Mnemonic';
import WalletTypes from './components/WalletTypes';
import CryptoWarning from './components/CryptoWarning';
import TabSection from 'containers/TabSection';
import { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { RouteNotFound } from 'components/RouteNotFound';

export enum WalletType {
  Keystore = 'keystore',
  Mnemonic = 'mnemonic'
}

export default class GenerateWallet extends Component<RouteComponentProps<{}>> {
  public render() {
    const currentPath = this.props.match.url;
    return (
      <React.Fragment>
        <TabSection>
          <section className="Tab-content">
            {window.crypto ? (
              <Switch>
                <Route exact={true} path={currentPath} component={WalletTypes} />
                <Route exact={true} path={`${currentPath}/keystore`} component={Keystore} />
                <Route exact={true} path={`${currentPath}/mnemonic`} component={Mnemonic} />
                <RouteNotFound />
              </Switch>
            ) : (
              <CryptoWarning />
            )}
          </section>
        </TabSection>
      </React.Fragment>
    );
  }
}
