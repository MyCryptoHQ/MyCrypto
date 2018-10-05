import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { NodeConfig } from 'types/node';
import { AppState } from 'features/reducers';
import {
  configNodesSelectors,
  configNodesSelectedActions,
  configNetworksActions,
  configSelectors,
  configNodesCustomTypes,
  configNodesCustomActions
} from 'features/config';
import { sidebarActions } from 'features/sidebar';
import show from 'assets/images/icn-show.svg';
import add from 'assets/images/icn-add.svg';
import CustomNodeModal from 'components/CustomNodeModal';

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

class NetworkOption extends Component {
  node = React.createRef();

  componentDidMount() {
    const { isSelected } = this.props;

    if (isSelected) {
      this.node.current.scrollIntoView();
    }
  }

  render() {
    const {
      onSelect,
      onNodeSelect,
      onClick,
      name,
      isToggled,
      nodes,
      isSecondary,
      isSelected,
      selectedNode
    } = this.props;

    return (
      <li
        className={classnames('NewNetworkOption', { 'is-secondary': isSecondary })}
        onClick={onClick}
        ref={this.node}
      >
        <section className="NewNetworkOption-name">
          <CustomRadio onClick={onSelect} enabled={isSelected} />
          {name}
        </section>
        {isToggled && (
          <ul className="NewNetworkOption-list">
            {nodes.map(
              node =>
                console.log('nodezzz', node.id, selectedNode) || (
                  <NodeOption
                    key={node.id}
                    name={node.service}
                    onClick={e => e.stopPropagation() || onNodeSelect(node.id)}
                    isSelected={selectedNode.id === node.id}
                    {...node}
                  />
                )
            )}
          </ul>
        )}
      </li>
    );
  }
}

const NodeOption = ({ onClick, name, isSelected }) => (
  <li className="NewNodeOption" onClick={onClick}>
    <CustomRadio enabled={isSelected} /> {name}
  </li>
);

const CustomRadio = ({ onClick, enabled = false }) => (
  <section className="CustomRadio" onClick={enabled ? () => {} : onClick}>
    {enabled && <section className="CustomRadio-inner" />}
  </section>
);

interface Props {
  changeNodeRequested: configNodesSelectedActions.TChangeNodeRequested;
  changeNetworkRequested: configNetworksActions.TChangeNetworkRequested;
  addCustomNode: configNodesCustomActions.TAddCustomNode;
  closeSidebar: sidebarActions.TCloseSidebar;
}

class SelectNetworkAndNode extends Component<Props> {
  state = {
    toggledNetworks: [],
    showingSecondaryNetworks: false,
    showingCustomNodeModal: false
  };

  componentDidMount() {
    const { selectedNode } = this.props;
    const showingSecondaryNetworks = !CORE_NETWORKS.includes(selectedNode.network);
    const toggledNetworks =
      selectedNode.isCustom || !selectedNode.isAuto ? [selectedNode.network] : [];

    this.setState({
      showingSecondaryNetworks,
      toggledNetworks
    });
  }

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

  toggleShowingCustomNodeModal = () =>
    this.setState(prevState => ({
      showingCustomNodeModal: !prevState.showingCustomNodeModal
    }));

  render() {
    const {
      selectedNode,
      selectedNetwork,
      allNodes,
      allNetworks,
      changeNetworkRequested,
      changeNodeRequested
    } = this.props;
    const { toggledNetworks, showingSecondaryNetworks, showingCustomNodeModal } = this.state;
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
        <ul className="SidebarScreen-list">
          {primaryNetworks.map(({ network, nodes }) => {
            const isSelected = selectedNetwork.id === network;
            const onSelect = () => this.handleNetworkSelect(allNetworks[network].id);
            const onNodeSelect = node => this.handleNodeSelect(node);
            const onClick = e => e.stopPropagation() || this.toggleNetwork(network);
            const name = allNetworks[network].name;
            const isToggled = toggledNetworks.includes(network);

            return (
              <NetworkOption
                key={network}
                isSelected={isSelected}
                onSelect={onSelect}
                onNodeSelect={onNodeSelect}
                selectedNode={selectedNode}
                onClick={onClick}
                name={name}
                isToggled={isToggled}
                nodes={nodes}
                isSecondary={false}
              />
            );
          })}
          <li onClick={this.toggleShowingSecondaryNetworks}>
            <section className="NewNetworkOption no-top-border">
              <section className="NewNetworkOption-name">
                <img src={show} alt="Toggle showing all networks" />
                {showingSecondaryNetworks ? 'Hide' : 'Show'} Other Networks
              </section>
            </section>
            {showingSecondaryNetworks && (
              <ul className="plain-ul">
                {secondaryNetworks.map(({ network, nodes }) => (
                  <NetworkOption
                    key={network}
                    isSelected={selectedNetwork.id === network}
                    onSelect={() => this.handleNetworkSelect(allNetworks[network].id)}
                    selectedNode={selectedNode}
                    onNodeSelect={node => this.handleNodeSelect(node)}
                    onClick={e => e.stopPropagation() || this.toggleNetwork(network)}
                    name={allNetworks[network].name}
                    isToggled={toggledNetworks.includes(network)}
                    nodes={nodes}
                    isSecondary={true}
                  />
                ))}
              </ul>
            )}
          </li>
        </ul>
        <section className="SidebarScreen-action">
          <section
            className="SidebarScreen-action-content"
            onClick={this.toggleShowingCustomNodeModal}
          >
            <img src={add} alt="Add custom node" />Add custom node
          </section>
        </section>
        {showingCustomNodeModal && (
          <CustomNodeModal
            isOpen={showingCustomNodeModal}
            addCustomNode={this.addCustomNode}
            handleClose={this.toggleShowingCustomNodeModal}
          />
        )}
      </section>
    );
  }

  private handleNetworkSelect = network => {
    const { changeNetworkRequested, closeSidebar } = this.props;

    changeNetworkRequested(network);
    closeSidebar();
  };

  private handleNodeSelect = node => {
    const { changeNodeRequested, closeSidebar } = this.props;

    changeNodeRequested(node);
    closeSidebar();
  };

  private addCustomNode = (payload: configNodesCustomTypes.AddCustomNodeAction['payload']) => {
    const { addCustomNode, closeSidebar } = this.props;

    addCustomNode(payload);
    closeSidebar();
  };
}

const mapStateToProps = (state: AppState) => ({
  selectedNode: configNodesSelectors.getNodeConfig(state),
  selectedNetwork: configSelectors.getNetworkConfig(state),
  allNodes: configSelectors.getAllNodes(state),
  allNetworks: configSelectors.getAllNetworkConfigs(state)
});

const mapDispatchToProps = {
  changeNodeRequested: configNodesSelectedActions.changeNodeRequested,
  changeNetworkRequested: configNetworksActions.changeNetworkRequested,
  closeSidebar: sidebarActions.closeSidebar,
  addCustomNode: configNodesCustomActions.addCustomNode
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectNetworkAndNode);
