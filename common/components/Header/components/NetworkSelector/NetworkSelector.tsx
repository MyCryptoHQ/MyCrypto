import React from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import { DropdownShell } from 'components/ui';
import NetworkOption from './NetworkOption';
import {
  TChangeNodeIntent,
  changeNodeIntent,
  TChangeNetworkIntent,
  changeNetworkIntent
} from 'actions/config';
import { getNodeId, getNodeConfig, getAllNodes, getAllNetworkConfigs } from 'selectors/config';
import { isAutoNodeConfig } from 'libs/nodes';
import { NodeConfig } from 'types/node';
import { NetworkConfig } from 'types/network';
import { AppState } from 'reducers';
import './NetworkSelector.scss';

const CORE_NETWORKS = ['ETH', 'ETC', 'Ropsten', 'Kovan', 'Rinkeby'];

interface OwnProps {
  openCustomNodeModal(): void;
}

interface StateProps {
  node: NodeConfig;
  nodeSelection: AppState['config']['nodes']['selectedNode']['nodeId'];
  allNodes: { [key: string]: NodeConfig };
  allNetworks: { [key: string]: NetworkConfig };
}

interface DispatchProps {
  changeNodeIntent: TChangeNodeIntent;
  changeNetworkIntent: TChangeNetworkIntent;
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

  private dropdown: DropdownShell | null;

  public componentDidMount() {
    const { allNodes, nodeSelection } = this.props;
    const node = allNodes[nodeSelection];
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
    const { nodeSelection } = this.props;

    return (
      <DropdownShell
        ariaLabel="Dropdown"
        renderLabel={this.renderLabel}
        renderOptions={this.renderOptions}
        disabled={nodeSelection === 'web3'}
        size="smr"
        color="white"
        ref={el => (this.dropdown = el)}
      />
    );
  }

  private renderLabel = () => {
    const { allNodes, allNetworks, nodeSelection } = this.props;
    const node = allNodes[nodeSelection];
    const network = allNetworks[node.network];
    let suffix;

    if (node.isCustom) {
      // Custom nodes have names
      suffix = node.name;
    } else if (node.isAuto) {
      // Auto nodes should show the count of all nodes it uses. If only one,
      // show the service name of the node.
      const networkNodes = Object.values(allNodes).filter(
        n => !isAutoNodeConfig(n) && n.network === node.network
      );

      if (networkNodes.length > 1) {
        suffix = `${networkNodes.length} Nodes`;
      } else {
        suffix = networkNodes[0].service;
      }
    } else {
      suffix = node.service;
    }

    return (
      <span>
        {network.name} <small>({suffix})</small>
      </span>
    );
  };

  private renderOptions = () => {
    const { allNodes, allNetworks, nodeSelection } = this.props;
    const { expandedNetwork, isShowingAltNetworks } = this.state;
    const selectedNode = allNodes[nodeSelection];

    const nodesByNetwork = {} as {
      [network: string]: NodeConfig[];
    };
    Object.values(allNodes).forEach((node: NodeConfig) => {
      if (!nodesByNetwork[node.network]) {
        nodesByNetwork[node.network] = [];
      }
      nodesByNetwork[node.network].push(node);
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
            nodeSelection={nodeSelection}
            isNetworkSelected={selectedNode.network === netKey}
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
        <button className="NetworkSelector-add" onClick={this.openCustomNodeModal}>
          <i className="fa fa-plus" />
          {translate('NODE_ADD')}
        </button>
      </div>
    );
  };

  private selectNetwork = (net: NetworkConfig) => {
    this.props.changeNetworkIntent(net.id);
    if (this.dropdown) {
      this.dropdown.close();
    }
  };

  private selectNode = (node: NodeConfig) => {
    this.props.changeNodeIntent(node.id);
    if (this.dropdown) {
      this.dropdown.close();
    }
  };

  private toggleNetworkExpand = (network: NetworkConfig) => {
    this.setState({
      expandedNetwork: network === this.state.expandedNetwork ? null : network
    });
  };

  private openCustomNodeModal = () => {
    this.props.openCustomNodeModal();
    if (this.dropdown) {
      this.dropdown.close();
    }
  };

  private toggleShowAltNetworks = () => {
    this.setState({ isShowingAltNetworks: !this.state.isShowingAltNetworks });
  };
}

export default connect(
  (state: AppState): StateProps => ({
    nodeSelection: getNodeId(state),
    node: getNodeConfig(state),
    allNodes: getAllNodes(state),
    allNetworks: getAllNetworkConfigs(state)
  }),
  {
    changeNodeIntent,
    changeNetworkIntent
  }
)(NetworkSelector);
