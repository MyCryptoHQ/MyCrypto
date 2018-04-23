import React from 'react';
import { connect } from 'react-redux';
import { DropdownShell } from 'components/ui';
import NetworkSelector from 'components/NetworkSelector';
import { getNodeId, getNodeConfig, getNetworkConfig, getAllNodes } from 'selectors/config';
import { isAutoNodeConfig } from 'libs/nodes';
import { NodeConfig } from 'types/node';
import { NetworkConfig } from 'types/network';
import { AppState } from 'reducers';
import './NetworkDropdown.scss';

interface OwnProps {
  openCustomNodeModal(): void;
}

interface StateProps {
  nodeSelection: string;
  node: NodeConfig;
  network: NetworkConfig;
  allNodes: { [key: string]: NodeConfig };
}

type Props = OwnProps & StateProps;

class NetworkDropdown extends React.Component<Props> {
  private dropdown: DropdownShell | null;

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

  private renderOptions = () => {
    return (
      <div className="NetworkDropdown-options">
        <NetworkSelector
          openCustomNodeModal={this.openModal}
          onSelectNetwork={this.onSelect}
          onSelectNode={this.onSelect}
        />
      </div>
    );
  };

  private renderLabel = () => {
    const { allNodes, network, node } = this.props;
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

  private onSelect = () => {
    if (this.dropdown) {
      this.dropdown.close();
    }
  };

  private openModal = () => {
    this.props.openCustomNodeModal();
    if (this.dropdown) {
      this.dropdown.close();
    }
  };
}

export default connect((state: AppState): StateProps => ({
  nodeSelection: getNodeId(state),
  node: getNodeConfig(state),
  network: getNetworkConfig(state),
  allNodes: getAllNodes(state)
}))(NetworkDropdown);
