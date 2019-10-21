import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { configNodesSelectors, configSelectors } from 'features/config';
import { DropdownShell } from 'components/ui';
import NetworkSelector from 'components/NetworkSelector';
import './NetworkDropdown.scss';

interface OwnProps {
  openCustomNodeModal(): void;
}

interface StateProps {
  node: ReturnType<typeof configNodesSelectors.getNodeConfig>;
  nodeLabel: ReturnType<typeof configSelectors.getSelectedNodeLabel>;
}

type Props = OwnProps & StateProps;

class NetworkDropdown extends React.Component<Props> {
  private dropdown: DropdownShell | null;

  public render() {
    const { node } = this.props;

    return (
      <DropdownShell
        ariaLabel="Dropdown"
        renderLabel={this.renderLabel}
        renderOptions={this.renderOptions}
        disabled={node.id === 'web3'}
        size="smr"
        color="white"
        ref={el => (this.dropdown = el)}
      />
    );
  }

  private renderLabel = () => {
    const { nodeLabel } = this.props;
    return (
      <span>
        {nodeLabel.network} <small>({nodeLabel.info})</small>
      </span>
    );
  };

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

export default connect(
  (state: AppState): StateProps => ({
    node: configNodesSelectors.getNodeConfig(state),
    nodeLabel: configSelectors.getSelectedNodeLabel(state)
  })
)(NetworkDropdown);
