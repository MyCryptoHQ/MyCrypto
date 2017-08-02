// @flow
import React from 'react';
import Modal from 'components/ui/Modal';

export default class ConfirmModal extends React.Component {
  _handleClose() {}

  render() {
    const buttons = [
      {
        text: 'Hello',
        onClick: () => alert('yo')
      }
    ];

    return (
      <Modal
        title="Confirm Transaction"
        buttons={buttons}
        handleClose={this._handleClose}
      >
        <h1>Yo</h1>
      </Modal>
    );
  }
}
