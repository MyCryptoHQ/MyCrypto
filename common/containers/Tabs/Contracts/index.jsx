// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accessContract } from 'actions/contracts';
import type { ABIFunction } from 'actions/contracts';
import { getNetworkContracts } from 'selectors/config';
import type { NetworkContract } from 'config/data';
import { State } from 'reducers/contracts';
import translate from 'translations';
import Interact from './components/Interact';
import Deploy from './components/Deploy';
import './index.scss';

type Props = {
  NetworkContracts: Array<NetworkContract>,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array<ABIFunction>,
  accessContract: Function
};

class Contracts extends Component {
  props: Props;

  state = {
    activeTab: 'interact'
  };

  changeTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    const {
      NetworkContracts,
      selectedAddress,
      selectedABIJson,
      selectedABIFunctions,
      accessContract
    } = this.props;
    const { activeTab } = this.state;
    let content = '';
    let interactActive = '';
    let deployActive = '';

    if (activeTab === 'interact') {
      content = (
        <Interact
          NetworkContracts={NetworkContracts}
          selectedAddress={selectedAddress}
          selectedABIJson={selectedABIJson}
          selectedABIFunctions={selectedABIFunctions}
          accessContract={accessContract}
        />
      );
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
  return {
    NetworkContracts: getNetworkContracts(state),
    selectedAddress: state.contracts.selectedAddress,
    selectedABIJson: state.contracts.selectedABIJson,
    selectedABIFunctions: state.contracts.selectedABIFunctions
  };
}

export default connect(mapStateToProps, { accessContract })(Contracts);
