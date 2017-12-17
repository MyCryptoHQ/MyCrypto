import React, { Component } from 'react';
import TabSection from 'containers/TabSection';
import SubTabs, { Tab } from 'components/SubTabs';
import Mnemonic from './components/Mnemonic';
import Keystore from './components/Keystore';
import { RouteComponentProps } from 'react-router-dom';

export default class GenerateWallet extends Component<RouteComponentProps<any>, {}> {
  public render() {
    const activeTab = this.props.location.pathname.split('/')[2];

    const KeyStoreTab: Tab = {
      path: 'keystore',
      name: 'Generate Wallet',
      render: () => <Keystore />
    };

    const MnemonicTab: Tab = {
      path: 'mnemonic',
      name: 'Generate Mnemonic',
      render: () => {
        return <Mnemonic />;
      }
    };

    const tabs: Tab[] = [KeyStoreTab, MnemonicTab];

    return (
      <TabSection>
        <SubTabs root="generate" tabs={tabs} activeTab={activeTab} />
      </TabSection>
    );
  }
}
