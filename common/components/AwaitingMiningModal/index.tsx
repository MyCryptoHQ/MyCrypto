import React, { ReactElement } from 'react';
import translate, { translateRaw } from 'translations';
import Modal from 'components/ui/Modal';
import './index.scss';
import { Spinner } from 'components/ui';
import { ETHTxExplorer } from 'config';

interface Props {
  isOpen: boolean;
  message?: ReactElement<any>;
  transactionHash: string;
}

export default class AwaitingMiningModal extends React.Component<Props> {
  public render() {
    return (
      <Modal
        title={translateRaw('AWAITING_MINING')}
        isOpen={this.props.isOpen}
        // tslint:disable-next-line:no-empty
        handleClose={() => {}}
      >
        <div className="AwaitingMiningModal-content">
          <Spinner size="x5" />
          <br />
          <br />
          {translate('SCHEDULE_TRANSACTION_MINING_PART_1')}
          <a
            href={ETHTxExplorer(this.props.transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {translate('SCHEDULE_TRANSACTION_MINING_PART_2')}
          </a>
          <br />
          <br />
          {this.props.message}
        </div>
      </Modal>
    );
  }
}
