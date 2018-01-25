import {
  ConfirmationModalTemplate,
  OwnProps as ConfirmationModalTemplateProps,
  ConfirmButtonCBProps
} from 'components/ConfirmationModalTemplate';
import { Summary } from 'components/ConfirmationModal/components';
import { Details, ModalHeader } from './components/Details';
import React from 'react';
import './Modals.scss';
import { ensUserDownloadedBid, TEnsUserDownloadedBid } from 'actions/ens/actionCreators/bidding';
import { connect } from 'react-redux';

import { EnsUserDownloadedBidAction } from 'actions/ens';
import { IButton } from 'components/ui/Modal';

interface OwnProps {
  onClose: ConfirmationModalTemplateProps['onClose'];
}

interface DispatchProps {
  ensUserDownloadedBid: TEnsUserDownloadedBid;
}

interface State {
  bidDownloaded: boolean;
  unsealDetails: EnsUserDownloadedBidAction['payload'] | null;
}

type Props = DispatchProps & OwnProps;

class BidModalClass extends React.Component<Props, State> {
  public state: State = {
    bidDownloaded: false,
    unsealDetails: null
  };

  public render() {
    return (
      <ConfirmationModalTemplate
        summary={
          <>
            {ModalHeader} <Summary />
          </>
        }
        details={<Details userDownloadedBid={this.handleUserDownloadedBid} />}
        withConfirmButton={(confButtonProps): IButton => {
          const { onConfirm, timeLocked, type } = confButtonProps;

          return {
            text: this.generateButtonText(confButtonProps),
            disabled: timeLocked || !this.state.bidDownloaded,
            type,
            onClick: this.handleConfirm(onConfirm)
          };
        }}
        onClose={this.props.onClose}
      />
    );
  }

  private handleConfirm = (defaultConfirm: ConfirmButtonCBProps['onConfirm']) => () => {
    const { unsealDetails } = this.state;
    if (!unsealDetails) {
      throw Error('Could not find unseal details to store in LS');
    }
    this.props.ensUserDownloadedBid(unsealDetails);
    defaultConfirm();
  };

  private generateButtonText = (defaultProps: ConfirmButtonCBProps): string => {
    const { defaultText, timePrefix } = defaultProps;
    const text = !this.state.bidDownloaded
      ? 'Please download your bid info first before sending this transaction'
      : timePrefix + defaultText;
    return text;
  };

  private handleUserDownloadedBid = (unsealDetails: EnsUserDownloadedBidAction['payload']) => {
    this.setState({ bidDownloaded: true, unsealDetails });
  };
}

export const BidModal = connect(null, { ensUserDownloadedBid })(BidModalClass);
