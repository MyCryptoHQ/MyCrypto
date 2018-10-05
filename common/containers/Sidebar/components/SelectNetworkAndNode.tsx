import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { NodeConfig } from 'types/node';
import { AppState } from 'features/reducers';
import {
  configNodesSelectors,
  configNodesSelectedActions,
  configNetworksActions,
  configSelectors
} from 'features/config';
import show from 'assets/images/icn-show.svg';
import add from 'assets/images/icn-add.svg';

const CORE_NETWORKS = ['ETH', 'ETC', 'Ropsten', 'Kovan', 'Rinkeby'];

interface NodeEntities {
  [key: string]: NodeConfig;
}

interface NetworkOptions {
  [key: string]: NodeConfig[];
}

interface PrioritizedNetworkOptions {
  primaryNetworks: any[];
  secondaryNetworks: any[];
}

function generateNetworksToNodes(nodes: NodeEntities): NetworkOptions {
  return Object.values(nodes).reduce((networksToNodes: NetworkOptions, nextNode) => {
    const { network } = nextNode;
    const newNetworkEntry = (networksToNodes[network] || []).concat(nextNode);

    networksToNodes[network] = newNetworkEntry;

    return networksToNodes;
  }, {});
}

function splitUpNetworkOptions(networksToNodes: NetworkOptions): PrioritizedNetworkOptions {
  return Object.entries(networksToNodes).reduce(
    (networkOptions, [network, nodes]) => {
      const { primaryNetworks, secondaryNetworks } = networkOptions;
      const collection = CORE_NETWORKS.includes(network) ? primaryNetworks : secondaryNetworks;

      collection.push({
        network,
        nodes
      });

      return networkOptions;
    },
    {
      primaryNetworks: [],
      secondaryNetworks: []
    } as PrioritizedNetworkOptions
  );
}

const NetworkOption = ({ onClick, name, isToggled, nodes, isSecondary }) => (
  <li className={classnames('NewNetworkOption', { 'is-secondary': isSecondary })} onClick={onClick}>
    <section className="NewNetworkOption-name">
      <CustomRadio enabled={isToggled} />
      {name}
    </section>
    {isToggled && (
      <ul className="NewNetworkOption-list">
        {nodes.map(node => (
          <NodeOption
            key={node.id}
            name={node.service}
            onClick={e => e.stopPropagation()}
            {...node}
          />
        ))}
      </ul>
    )}
  </li>
);

const NodeOption = ({ onClick, name }) => (
  <li className="NewNodeOption" onClick={onClick}>
    <CustomRadio enabled={false} /> {name}
  </li>
);

const CustomRadio = ({ enabled = false }) => (
  <section className="CustomRadio">{enabled && <section className="CustomRadio-inner" />}</section>
);

class SelectNetworkAndNode extends Component {
  state = {
    toggledNetworks: [],
    showingSecondaryNetworks: false
  };

  toggleNetwork = network =>
    this.setState(prevState => ({
      toggledNetworks: prevState.toggledNetworks.includes(network)
        ? prevState.toggledNetworks.filter(toggledNetwork => toggledNetwork !== network)
        : prevState.toggledNetworks.concat(network)
    }));

  toggleShowingSecondaryNetworks = () =>
    this.setState(prevState => ({
      showingSecondaryNetworks: !prevState.showingSecondaryNetworks
    }));

  render() {
    const { node, network, allNodes, allNetworks } = this.props;
    const { toggledNetworks, showingSecondaryNetworks } = this.state;
    const networksToNodes = generateNetworksToNodes(allNodes);
    const { primaryNetworks, secondaryNetworks } = splitUpNetworkOptions(networksToNodes);

    return (
      <section className="SidebarScreen">
        <section className="SidebarScreen-upper">
          <h1 className="SidebarScreen-heading">Select Your Preferred Network and Node</h1>
          <p className="SidebarScreen-text">
            You can access your MyCrypto funds on different Networks and Nodes, simply choose one
            below or add a custom node.
          </p>
        </section>
        {/*  */}
        <ul className="SidebarScreen-list">
          {primaryNetworks.map(({ network, nodes }) => (
            <NetworkOption
              key={network}
              onClick={e => e.stopPropagation() || this.toggleNetwork(network)}
              name={allNetworks[network].name}
              isToggled={toggledNetworks.includes(network)}
              nodes={nodes}
            />
          ))}
          {/*  */}
          <li onClick={this.toggleShowingSecondaryNetworks}>
            <section className="NewNetworkOption no-top-border">
              <section className="NewNetworkOption-name">
                <img src={show} alt="Toggle showing all networks" />
                {showingSecondaryNetworks ? 'Hide' : 'Show'} Other Networks
              </section>
            </section>
            {showingSecondaryNetworks &&
              secondaryNetworks.map(({ network, nodes }) => (
                <NetworkOption
                  key={network}
                  onClick={e => e.stopPropagation() || this.toggleNetwork(network)}
                  name={allNetworks[network].name}
                  isToggled={toggledNetworks.includes(network)}
                  nodes={nodes}
                  isSecondary={true}
                />
              ))}
          </li>
        </ul>
        <section className="SidebarScreen-action">
          <section className="SidebarScreen-action-content">
            <img src={add} alt="Add custom node" />Add custom node
          </section>
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  node: configNodesSelectors.getNodeConfig(state),
  network: configSelectors.getNetworkConfig(state),
  allNodes: configSelectors.getAllNodes(state),
  allNetworks: configSelectors.getAllNetworkConfigs(state)
});

export default connect(mapStateToProps)(SelectNetworkAndNode);
