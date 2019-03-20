import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import { configNodesCustomActions } from 'features/config';
import { NodeConfig } from 'types/node';
import './NodeOption.scss';

interface OwnProps {
  node: NodeConfig;
  isSelected: boolean;
  isAutoSelected: boolean;
  select(node: NodeConfig): void;
}

interface DispatchProps {
  removeCustomNode: configNodesCustomActions.TRemoveCustomNode;
}

type Props = OwnProps & DispatchProps;

class NodeOption extends React.PureComponent<Props> {
  public render() {
    const { node, isSelected, isAutoSelected } = this.props;
    return (
      <div className="NodeOption" key={node.service}>
        <div
          className={classnames(
            'NodeOption-name',
            isSelected && 'is-selected',
            isAutoSelected && 'is-auto-selected'
          )}
          title={translateRaw('NETWORKS_SWITCH_NODE', {
            $node: node.isCustom ? node.name : node.service,
            $network: node.network
          })}
          onClick={this.handleSelect}
        >
          {node.isCustom ? node.name : node.service}
        </div>
        {node.isCustom && (
          <button className="NodeOption-remove" onClick={this.handleRemove}>
            <i className="fa fa-times-circle" />
          </button>
        )}
      </div>
    );
  }

  private handleSelect = () => {
    this.props.select(this.props.node);
  };

  private handleRemove = () => {
    if (this.props.node.isCustom) {
      this.props.removeCustomNode(this.props.node.id);
    }
  };
}

export default connect(undefined, { removeCustomNode: configNodesCustomActions.removeCustomNode })(
  NodeOption
);
