import React from 'react';
import Modal, { IButton } from './ui/Modal';

interface Props {
  onConfirm?: any;
  onCancel?: any;
  description: React.ReactElement<any> | string;
  title: string;
  revertPath: string;
  children: React.ReactElement<any>;
}

interface State {
  openModal: boolean;
}

export default class AcceptOrRedirectModal extends React.Component<Props, State> {
  public state = {
    openModal: true
  };

  public onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    // TODO USE LOCATION
    window.location.href = this.props.revertPath;
  };

  public onConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
    this.setState({ openModal: false });
  };

  public render() {
    const { children } = this.props;
    const buttons: IButton[] = [
      { text: 'Continue', type: 'primary', onClick: this.onConfirm },
      { text: 'Cancel', type: 'default', onClick: this.onCancel }
    ];
    return (
      <div>
        <Modal
          title={this.props.title}
          isOpen={this.state.openModal}
          handleClose={this.onCancel}
          buttons={buttons}
        >
          {this.props.description}
        </Modal>
        {!this.state.openModal && children}
      </div>
    );
  }
}
