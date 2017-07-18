// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import translate from 'translations';
import Interact from './components/Interact';
import Deploy from './components/Deploy';
import './index.scss';

type Props = {};

class Contracts extends Component {
  props: Props;
  static propTypes = {};

  state = {
    activeTab: 'interact'
  };

  changeTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    const { activeTab } = this.state;
    let content, interactActive, deployActive;

    if (activeTab === 'interact') {
      content = <Interact />;
      interactActive = 'is-active';
    } else {
      content = <Deploy />;
      deployActive = 'is-active';
    }

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active" role="main">
            <div className="Contracts">
              <h1 className="Contracts-header">
                <button
                  className={`Contracts-header-tab ${interactActive}`}
                  onClick={this.changeTab.bind(this, 'interact')}
                >
                  {translate('NAV_InteractContract')}
                </button>{' '}
                <span>or</span>{' '}
                <button
                  className={`Contracts-header-tab ${deployActive}`}
                  onClick={this.changeTab.bind(this, 'deploy')}
                >
                  {translate('NAV_DeployContract')}
                </button>
              </h1>

              <div className="Contracts-content">
                {content}
              </div>
            </div>
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state: State) {
  return {};
}

export default connect(mapStateToProps)(Contracts);
