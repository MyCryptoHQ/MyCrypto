import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NodeConfig } from 'types/node';
import { AppState } from 'features/reducers';
import {
  configNodesSelectors,
  configNodesSelectedActions,
  configNetworksActions,
  configSelectors
} from 'features/config';

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

const NetworkOption = ({ onClick, name, isToggled, nodes }) => (
  <li onClick={onClick}>
    {name}
    {isToggled && (
      <ul>
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

const NodeOption = ({ onClick, name }) => <li onClick={onClick}>{name}</li>;

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
        <h1 className="SidebarScreen-heading">Select Your Preferred Network and Node</h1>
        <p className="SidebarScreen-text">
          You can access your MyCrypto funds on different Networks and Nodes, simply choose one
          below or add a custom node.
        </p>
        {/*  */}
        <ul>
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
            {showingSecondaryNetworks ? 'Hide' : 'Show'} Other Networks
            {showingSecondaryNetworks &&
              secondaryNetworks.map(({ network, nodes }) => (
                <NetworkOption
                  key={network}
                  onClick={e => e.stopPropagation() || this.toggleNetwork(network)}
                  name={allNetworks[network].name}
                  isToggled={toggledNetworks.includes(network)}
                  nodes={nodes}
                />
              ))}
          </li>
        </ul>
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
