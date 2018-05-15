import React from 'react';
import translate, { translateRaw } from 'translations';
import classnames from 'classnames';
import { isAutoNode, isAutoNodeConfig } from 'libs/nodes';
import { NodeConfig } from 'types/node';
import { NetworkConfig } from 'types/network';
import NodeOption from './NodeOption';
import './NetworkOption.scss';

interface Props {
  nodes: NodeConfig[];
  network: NetworkConfig;
  nodeSelection: string;
  isNetworkSelected: boolean;
  isExpanded: boolean;
  selectNode(node: NodeConfig): void;
  selectNetwork(network: NetworkConfig): void;
  toggleExpand(network: NetworkConfig): void;
}

export default class NetworkOption extends React.PureComponent<Props> {
  public render() {
    const { nodes, network, nodeSelection, isExpanded, isNetworkSelected } = this.props;
    const borderLeftColor = network.isCustom ? '#CCC' : network.color;
    const singleNodes = nodes.filter(node => !isAutoNodeConfig(node));
    const isAutoSelected = isNetworkSelected && isAutoNode(nodeSelection);
    const isLongName = network.name.length > 14;

    return (
      <div className="NetworkOption" style={{ borderLeftColor }}>
        <div className="NetworkOption-label">
          <div
            className={classnames({
              'NetworkOption-label-name': true,
              'is-selected': isNetworkSelected,
              'is-specific-node': isNetworkSelected && !isAutoSelected && singleNodes.length > 1,
              'is-long-name': isLongName
            })}
            title={translateRaw('NETWORKS_SWITCH', { $network: network.name })}
            onClick={this.handleSelect}
          >
            {network.name}
            {network.isTestnet && (
              <small className="NetworkOption-label-name-badge">({translate('TESTNET')})</small>
            )}
          </div>
          <button
            className={classnames('NetworkOption-label-expand', isExpanded && 'is-expanded')}
            onClick={this.handleToggleExpand}
            title={translateRaw('NETWORKS_EXPAND_NODES', { $network: network.name })}
          >
            <i className="fa fa-chevron-down" />
          </button>
        </div>
        {isExpanded && (
          <div className="NetworkOption-nodes">
            {singleNodes.map(node => (
              <NodeOption
                key={node.id}
                node={node}
                isSelected={node.id === nodeSelection}
                isAutoSelected={isAutoSelected}
                select={this.props.selectNode}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  private handleSelect = () => {
    this.props.selectNetwork(this.props.network);
  };

  private handleToggleExpand = () => {
    this.props.toggleExpand(this.props.network);
  };
}
