import React, { Component } from 'react';
import translate from 'translations';
import SignMessage from './components/SignMessage';
import VerifyMessage from './components/VerifyMessage';
import TabSection from 'containers/TabSection';
import './index.scss';
import SubTabs, { Tab } from 'components/SubTabs';
import { RouteComponentProps } from 'react-router';

export default class SignAndVerifyMessage extends Component<RouteComponentProps<any>, {}> {
  public render() {
    const { location } = this.props;
    const activeTab = location.pathname.split('/')[2];

    const SignTab: Tab = {
      path: 'sign',
      name: translate('NAV_SignMsg'),
      render: () => <SignMessage />
    };

    const VerifyTab: Tab = {
      path: 'verify',
      name: translate('MSG_verify'),
      render: () => <VerifyMessage />
    };

    const tabs: Tab[] = [SignTab, VerifyTab];

    return (
      <TabSection>
        <section className="Tab-content SignAndVerifyMsg">
          <SubTabs root="message" tabs={tabs} activeTab={activeTab} />
        </section>
      </TabSection>
    );
  }
}
