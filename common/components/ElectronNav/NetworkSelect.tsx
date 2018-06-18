import React from 'react';
import { connect } from 'react-redux';

import { TAddCustomNode, AddCustomNodeAction, addCustomNode } from 'features/config';
import NetworkSelector from 'components/NetworkSelector';
import CustomNodeModal from 'components/CustomNodeModal';

interface OwnProps {
  closePanel(): void;
}

interface DispatchProps {
  addCustomNode: TAddCustomNode;
}

type Props = OwnProps & DispatchProps;

interface State {
  isAddingCustomNode: boolean;
}

class NetworkSelect extends React.Component<Props, State> {
  public state: State = {
    isAddingCustomNode: false
  };

  public render() {
    const { isAddingCustomNode } = this.state;
    return (
      <React.Fragment>
        <NetworkSelector
          onSelectNetwork={this.props.closePanel}
          onSelectNode={this.props.closePanel}
          openCustomNodeModal={this.openCustomNodeModal}
        />
        <CustomNodeModal
          isOpen={isAddingCustomNode}
          addCustomNode={this.addCustomNode}
          handleClose={this.closeCustomNodeModal}
        />
      </React.Fragment>
    );
  }

  private openCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: true });
  };

  private closeCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: false });
  };

  private addCustomNode = (payload: AddCustomNodeAction['payload']) => {
    this.closeCustomNodeModal();
    this.props.addCustomNode(payload);
    this.props.closePanel();
  };
}

export default connect(undefined, { addCustomNode })(NetworkSelect);
