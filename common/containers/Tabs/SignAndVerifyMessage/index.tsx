import React, { Component } from 'react';
import translate from 'translations';
import SignMessage from './components/SignMessage';
import VerifyMessage from './components/VerifyMessage';
import TabSection from 'containers/TabSection';
import './index.scss';

interface State {
  activeTab: 'sign' | 'verify';
}

export default class SignAndVerifyMessage extends Component<{}, State> {
  public state: State = {
    activeTab: 'sign'
  };

  public changeTab = (activeTab: State['activeTab']) => () => this.setState({ activeTab });

  public render() {
    const { activeTab } = this.state;
    let content;
    let signActive = '';
    let verifyActive = '';

    if (activeTab === 'sign') {
      content = <SignMessage />;
      signActive = 'is-active';
    } else {
      content = <VerifyMessage />;
      verifyActive = 'is-active';
    }

    return (
      <TabSection>
        <section className="Tab-content SignAndVerifyMsg">
          <div className="Tab-content-pane">
            <h1 className="SignAndVerifyMsg-header">
              <button
                className={`SignAndVerifyMsg-header-tab ${signActive}`}
                onClick={this.changeTab('sign')}
              >
                {translate('Sign Message')}
              </button>{' '}
              <span>or</span>{' '}
              <button
                className={`SignAndVerifyMsg-header-tab ${verifyActive}`}
                onClick={this.changeTab('verify')}
              >
                {translate('Verify Message')}
              </button>
            </h1>
          </div>

          <main role="main">{content}</main>
        </section>
      </TabSection>
    );
  }
}
