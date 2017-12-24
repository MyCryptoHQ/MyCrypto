import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import './Modals.scss';

interface Props {
  when: boolean;
  onConfirm?: any;
  onCancel?: any;
}

interface State {
  modalOpen: boolean;
}

class AuctionModal extends React.Component<Props, State> {
  public state: any = {};

  public componentDidMount() {
    // do a thing
  }

  public componentWillUnmount() {
    // do a thing
  }

  public onCancel = () => {
    // do a thing
  };

  public onConfirm = () => {
    // do a thing
  };

  public render() {
    const buttons: IButton[] = [
      { text: 'Start Auction', type: 'primary', onClick: this.onConfirm },
      { text: 'Cancel', type: 'default', onClick: this.onCancel }
    ];
    return (
      <Modal
        title="Start an auction"
        isOpen={this.state.openModal}
        handleClose={this.onCancel}
        buttons={buttons}
      >
        <p>Content...</p>
      </Modal>
    );
  }
}

export default AuctionModal;
