import React from 'react';
import translate from 'translations';
import Modal, { IButton } from 'components/ui/Modal';

export interface Props {
  networkName: string;
  network: string;
  service: string;
  action: string;
  handleBroadcastTx(): void;
  onClose(): void;
}

export type TTxModal = typeof TxModal;

export const TxModal = (props: Props) => {
  const {
    networkName,
    network,
    service,
    handleBroadcastTx,
    onClose,
    action
  } = props;

  const buttons: IButton[] = [
    {
      text: translate('SENDModal_Yes', true) as string,
      type: 'primary',
      onClick: handleBroadcastTx
    },
    {
      text: translate('SENDModal_No', true) as string,
      type: 'default',
      onClick: onClose
    }
  ];

  return (
    <Modal
      title="Confirm Your Transaction"
      buttons={buttons}
      handleClose={onClose}
      isOpen={true}
    >
      <div className="modal-body">
        <h2 className="modal-title text-danger">
          {translate('SENDModal_Title')}
        </h2>

        <p>
          You are about to <strong>{action}</strong> on the{' '}
          <strong>{networkName}</strong> chain.
        </p>

        <p>
          The <strong>{network}</strong> node you are sending through is
          provided by <strong>{service}</strong>.
        </p>

        <h4>{translate('SENDModal_Content_3')}</h4>
      </div>
    </Modal>
  );
};
