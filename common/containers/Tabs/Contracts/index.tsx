import React, { Component } from 'react';
import translate from 'translations';
import Interact from './components/Interact';
import Deploy from './components/Deploy';
import './index.scss';
import TabSection from 'containers/TabSection';

interface State {
  activeTab: string;
}

export default class Contracts extends Component<{}, State> {
  public state: State = {
    activeTab: 'interact'
  };

  public changeTab = activeTab => () => this.setState({ activeTab });

  public render() {
    const { activeTab } = this.state;
    let content;
    let interactActive = '';
    let deployActive = '';

    if (activeTab === 'interact') {
      content = <Interact />;
      interactActive = 'is-active';
    } else {
      content = <Deploy />;
      deployActive = 'is-active';
    }

    return (
      <TabSection>
        <section className="Tab-content Contracts">
          <div className="Tab-content-pane">
            <h1 className="Contracts-header">
              <button
                className={`Contracts-header-tab ${interactActive}`}
                onClick={this.changeTab('interact')}
              >
                {translate('NAV_InteractContract')}
              </button>{' '}
              <span>or</span>{' '}
              <button
                className={`Contracts-header-tab ${deployActive}`}
                onClick={this.changeTab('deploy')}
              >
                {translate('NAV_DeployContract')}
              </button>
            </h1>
          </div>

          <main className="Tab-content-pane" role="main">
            <div className="Contracts-content">{content}</div>
          </main>
        </section>
      </TabSection>
    );
  }
}
