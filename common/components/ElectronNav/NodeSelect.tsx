import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode,
  changeNodeIntent,
  addCustomNode,
  removeCustomNode
} from 'actions/config';
import {
  isNodeChanging,
  getNodeId,
  CustomNodeOption,
  NodeOption,
  getNodeOptions
} from 'selectors/config';
import { AppState } from 'reducers';
import './NodeSelect.scss';

interface OwnProps {
  closePanel(): void;
}

interface StateProps {
  nodeSelection: AppState['config']['nodes']['selectedNode']['nodeId'];
  isChangingNode: AppState['config']['nodes']['selectedNode']['pending'];
  nodeOptions: (CustomNodeOption | NodeOption)[];
}

interface DispatchProps {
  changeNodeIntent: TChangeNodeIntent;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
}

type Props = OwnProps & StateProps & DispatchProps;

class NodeSelect extends React.Component<Props> {
  public render() {
    const { nodeSelection, nodeOptions } = this.props;

    return (
      <div className="NodeSelect">
        {nodeOptions.map(node => (
          <button
            className={classnames({
              'NodeSelect-node': true,
              'is-active': node.value === nodeSelection
            })}
            onClick={() => this.handleNodeSelect(node.value)}
            style={{ borderLeftColor: node.color }}
          >
            {this.renderNodeLabel(node)}
          </button>
        ))}
      </div>
    );
  }

  private handleNodeSelect = (node: string) => {
    this.props.changeNodeIntent(node);
    this.props.closePanel();
  };

  private renderNodeLabel(node: CustomNodeOption | NodeOption) {
    return node.isCustom ? (
      <span>
        {node.label.network} - {node.label.nodeName} <small>(custom)</small>
      </span>
    ) : (
      <span>
        {node.label.network} - <small>({node.label.service})</small>
      </span>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    isChangingNode: isNodeChanging(state),
    nodeSelection: getNodeId(state),
    nodeOptions: getNodeOptions(state)
  }),
  {
    changeNodeIntent,
    addCustomNode,
    removeCustomNode
  }
)(NodeSelect);
