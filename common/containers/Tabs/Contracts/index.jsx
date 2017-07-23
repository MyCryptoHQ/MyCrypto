// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  accessContract,
  deployContract,
  fetchNodeContracts
} from 'actions/contracts';
import { State } from 'reducers/contracts';
import translate from 'translations';
import Interact from './components/Interact';
import Deploy from './components/Deploy';
import './index.scss';

type Props = {
  nodeContracts: Array,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array,
  accessContract: Function,
  deployContract: Function
};

class Contracts extends Component {
  props: Props;
  static propTypes = {
    // Store state
    nodeContracts: PropTypes.array.isRequired,
    selectedAddress: PropTypes.string,
    selectedABIJson: PropTypes.string,
    selectedABIFunctions: PropTypes.array,
    // Actions
    fetchNodeContracts: PropTypes.func.isRequired,
    accessContract: PropTypes.func.isRequired,
    deployContract: PropTypes.func.isRequired
  };

  state = {
    activeTab: 'interact'
  };

  constructor(props) {
    super(props);

    this.props.fetchNodeContracts();
  }

  changeTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    const {
      nodeContracts,
      selectedAddress,
      selectedABIJson,
      selectedABIFunctions,
      accessContract,
      deployContract
    } = this.props;
    const { activeTab } = this.state;
    let content, interactActive, deployActive;

    if (activeTab === 'interact') {
      content = (
        <Interact
          nodeContracts={nodeContracts}
          selectedAddress={selectedAddress}
          selectedABIJson={selectedABIJson}
          selectedABIFunctions={selectedABIFunctions}
          accessContract={accessContract}
        />
      );
      interactActive = 'is-active';
    } else {
      content = <Deploy deployContract={deployContract} />;
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
    nodeContracts: state.contracts.nodeContracts,
    selectedAddress: state.contracts.selectedAddress,
    selectedABIJson: state.contracts.selectedABIJson,
    selectedABIFunctions: state.contracts.selectedABIFunctions
  };
}

export default connect(mapStateToProps, {
  fetchNodeContracts,
  accessContract,
  deployContract
})(Contracts);
