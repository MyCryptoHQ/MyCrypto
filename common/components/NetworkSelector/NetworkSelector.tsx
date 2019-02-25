import React from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { NodeConfig } from 'types/node';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import {
  configNodesSelectors,
  configNodesSelectedActions,
  configNetworksActions,
  configSelectors
} from 'features/config';
import NetworkOption from './NetworkOption';
import './NetworkSelector.scss';

const CORE_NETWORKS = ['ETH', 'ETC', 'Ropsten', 'Kovan', 'Rinkeby', 'Goerli'];

interface OwnProps {
  openCustomNodeModal(): void;
  onSelectNetwork?(network: NetworkConfig): void;
  onSelectNode?(node: NodeConfig): void;
}

interface StateProps {
  node: NodeConfig;
  network: NetworkConfig;
  allNodes: { [key: string]: NodeConfig };
  allNetworks: { [key: string]: NetworkConfig };
}

interface DispatchProps {
  changeNodeRequested: configNodesSelectedActions.TChangeNodeRequested;
  changeNetworkRequested: configNetworksActions.TChangeNetworkRequested;
}

interface State {
  isShowingAltNetworks: boolean;
  expandedNetwork: null | NetworkConfig;
}

type Props = OwnProps & StateProps & DispatchProps;

class NetworkSelector extends React.Component<Props> {
  public state: State = {
    isShowingAltNetworks: false,
    expandedNetwork: null
  };

  public componentDidMount() {
    const { node } = this.props;
    const newState = { ...this.state };
    // Expand alt networks by default if they're on one
    if (!CORE_NETWORKS.includes(node.network)) {
      newState.isShowingAltNetworks = true;
    }
    // Expand the network they're on if they selected a specific node
    if (node.isCustom || !node.isAuto) {
      newState.expandedNetwork = this.props.allNetworks[node.network];
    }
    this.setState(newState);
  }

  public render() {
    const { allNodes, allNetworks, node } = this.props;
    const { expandedNetwork, isShowingAltNetworks } = this.state;

    const nodesByNetwork = {} as {
      [network: string]: NodeConfig[];
    };
    Object.values(allNodes).forEach((n: NodeConfig) => {
      if (!nodesByNetwork[n.network]) {
        nodesByNetwork[n.network] = [];
      }
      nodesByNetwork[n.network].push(n);
    }, {});

    const options = {
      core: [] as React.ReactElement<any>[],
      alt: [] as React.ReactElement<any>[]
    };
    Object.keys(nodesByNetwork)
      .sort((a, b) => {
        // Sort by CORE_NETWORKS first, custom networks last
        const idxA = CORE_NETWORKS.includes(a) ? CORE_NETWORKS.indexOf(a) : 999;
        const idxB = CORE_NETWORKS.includes(b) ? CORE_NETWORKS.indexOf(b) : 999;
        return idxA - idxB;
      })
      .forEach(netKey => {
        const network = allNetworks[netKey];
        const nodeType = CORE_NETWORKS.includes(netKey) || network.isCustom ? 'core' : 'alt';
        options[nodeType].push(
          <NetworkOption
            key={netKey}
            network={allNetworks[netKey]}
            nodes={nodesByNetwork[netKey]}
            nodeSelection={node.id}
            isNetworkSelected={node.network === netKey}
            isExpanded={expandedNetwork === allNetworks[netKey]}
            selectNetwork={this.selectNetwork}
            selectNode={this.selectNode}
            toggleExpand={this.toggleNetworkExpand}
          />
        );
      });

    return (
      <div className="NetworkSelector">
        {options.core}
        <button className="NetworkSelector-alts" onClick={this.toggleShowAltNetworks}>
          <i className="fa fa-flask" />
          {translate(isShowingAltNetworks ? 'HIDE_THING' : 'SHOW_THING', {
            $thing: translateRaw('NETWORKS_ALTERNATIVE')
          })}
        </button>
        {isShowingAltNetworks && options.alt}
        <button className="NetworkSelector-add" onClick={this.props.openCustomNodeModal}>
          <i className="fa fa-plus" />
          {translate('NODE_ADD')}
        </button>
      </div>
    );
  }

  private selectNetwork = (net: NetworkConfig) => {
    const { node } = this.props;
    if (net.id === node.network && node.isAuto) {
      return;
    }

    this.props.changeNetworkRequested(net.id);
    if (this.props.onSelectNetwork) {
      this.props.onSelectNetwork(net);
    }
  };

  private selectNode = (node: NodeConfig) => {
    if (node.id === this.props.node.id) {
      return;
    }

    this.props.changeNodeRequested(node.id);
    if (this.props.onSelectNode) {
      this.props.onSelectNode(node);
    }
  };

  private toggleNetworkExpand = (network: NetworkConfig) => {
    this.setState({
      expandedNetwork: network === this.state.expandedNetwork ? null : network
    });
  };

  private toggleShowAltNetworks = () => {
    this.setState({ isShowingAltNetworks: !this.state.isShowingAltNetworks });
  };
}

export default connect(
  (state: AppState): StateProps => ({
    node: configNodesSelectors.getNodeConfig(state),
    network: configSelectors.getNetworkConfig(state),
    allNodes: configSelectors.getAllNodes(state),
    allNetworks: configSelectors.getAllNetworkConfigs(state)
  }),
  {
    changeNodeRequested: configNodesSelectedActions.changeNodeRequested,
    changeNetworkRequested: configNetworksActions.changeNetworkRequested
  }
)(NetworkSelector);
