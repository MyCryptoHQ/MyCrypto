import React from 'react';
import translate from 'translations';
import Modal, { IButton } from 'components/ui/Modal';
import { BroadcastTransactionStatus } from 'libs/transaction';

export interface Props {
  chainName: string;
  nodeName: string;
  nodeProvider: string;
  handleBroadcastTx(): void;
  onClose(): void;
}

export type TDeployModal = typeof DeployModal;

export const DeployModal = (props: Props) => {
  const {
    chainName,
    nodeName,
    nodeProvider,
    handleBroadcastTx,
    onClose
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
          You are about to <strong>deploy a contract</strong> on the{' '}
          <strong>{chainName}</strong> chain.
        </p>

        <p>
          The <strong>{nodeName}</strong> node you are sending through is
          provided by <strong>{nodeProvider}</strong>.
        </p>

        <h4>{translate('SENDModal_Content_3')}</h4>
      </div>
    </Modal>
  );
};
