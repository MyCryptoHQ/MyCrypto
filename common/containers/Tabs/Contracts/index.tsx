import translate from 'translations';
import { Interact } from './components/Interact';
import { Deploy } from './components/Deploy';
import './index.scss';
import { reset, TReset } from 'actions/transaction';
import { resetWallet, TResetWallet } from 'actions/wallet';
import TabSection from 'containers/TabSection';
import React, { Component } from 'react';
import { connect } from 'react-redux';

interface State {
  activeTab: 'interact' | 'deploy';
}

interface Props {
  reset: TReset;
  resetWallet: TResetWallet;
}

class Contracts extends Component<Props, State> {
  public state: State = {
    activeTab: 'interact'
  };

  public changeTab = (activeTab: State['activeTab']) => () => {
    this.props.reset();
    this.props.resetWallet();
    this.setState({ activeTab });
  };

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
      <TabSection isUnavailableOffline={true}>
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

          <div className="Contracts-content">{content}</div>
        </section>
      </TabSection>
    );
  }
}

export default connect(null, { reset, resetWallet })(Contracts);
