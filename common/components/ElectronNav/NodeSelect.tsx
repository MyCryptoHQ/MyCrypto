import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'translations';
import CustomNodeModal from 'components/CustomNodeModal';
import {
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode,
  changeNodeIntent,
  addCustomNode,
  removeCustomNode,
  AddCustomNodeAction
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

interface State {
  isAddingCustomNode: boolean;
}

class NodeSelect extends React.Component<Props, State> {
  public state: State = {
    isAddingCustomNode: false
  };

  public render() {
    const { nodeSelection, nodeOptions } = this.props;
    const { isAddingCustomNode } = this.state;

    return (
      <div className="NodeSelect">
        {nodeOptions.map(node => (
          <button
            key={node.value}
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
        <button className="NodeSelect-node is-add" onClick={this.openCustomNodeModal}>
          {translate('NODE_ADD')}
        </button>

        <CustomNodeModal
          isOpen={isAddingCustomNode}
          addCustomNode={this.addCustomNode}
          handleClose={this.closeCustomNodeModal}
        />
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

  private openCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: true });
  };

  private closeCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: false });
  };

  private addCustomNode = (payload: AddCustomNodeAction['payload']) => {
    this.props.addCustomNode(payload);
    this.closeCustomNodeModal();
  };
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
