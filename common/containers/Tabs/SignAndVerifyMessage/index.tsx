import React, { Component } from 'react';
import SignMessage from './components/SignMessage';
import VerifyMessage from './components/VerifyMessage';
import TabSection from 'containers/TabSection';
import './index.scss';

import SubTabs, { Tab } from 'components/SubTabs';

interface Props {
  location: any;
}

export default class SignAndVerifyMessage extends Component<Props, {}> {
  public render() {
    const { location } = this.props;
    const activeTab = location.pathname.split('/')[2];

    const tabs: Tab[] = [
      {
        path: 'sign',
        name: 'Sign Message',
        render() {
          return <SignMessage />;
        }
      },
      {
        path: 'verify',
        name: 'Verify Message',
        render() {
          return <VerifyMessage />;
        }
      }
    ];

    return (
      <TabSection>
        <section className="Tab-content SignAndVerifyMsg">
          <SubTabs root="message" tabs={tabs} activeTab={activeTab} />
        </section>
      </TabSection>
    );
  }
}
