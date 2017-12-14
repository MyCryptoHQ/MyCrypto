import React, { Component } from 'react';
import TabSection from 'containers/TabSection';
import SubTabs, { Tab } from 'components/SubTabs';
import Mnemonic from './components/Mnemonic';
import Keystore from './components/Keystore';

interface Props {
  location: any;
}

export default class GenerateWallet extends Component<Props, {}> {
  public render() {
    const activeTab = this.props.location.pathname.split('/')[2];
    const tabs: Tab[] = [
      {
        path: 'keystore',
        name: 'Generate Wallet',
        render: () => {
          return <Keystore />;
        }
      },
      {
        path: 'mnemonic',
        name: 'Generate Mnemonic',
        render: () => {
          return <Mnemonic />;
        }
      }
    ];
    return (
      <TabSection>
        <SubTabs root="generate" tabs={tabs} activeTab={activeTab} />
      </TabSection>
    );
  }
}
