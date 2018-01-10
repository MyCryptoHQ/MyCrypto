import React, { Component } from 'react';
import { TShowNotification, showNotification } from 'actions/notifications';
import BidModal from '../../modals/BidModal';
import { connect } from 'react-redux';
import { BidMask, BidValue, Name, SecretPhrase } from './components';
import { GenerateBid } from 'components/GenerateBid';
import { setCurrentValue, TSetCurrentValue } from 'actions/transaction';
import { GasField, NonceField } from 'components';

interface DispatchProps {
  setCurrentValue: TSetCurrentValue;
  showNotification: TShowNotification;
}

interface OwnProps {
  title: string;
  domainName: string;
  buttonName: string;
}

interface State {
  openModal: boolean;
  bidValue: string;
  bidMask: string;
  secretPhrase: string;
}

type Props = OwnProps & DispatchProps;

class PlaceBid extends Component<Props, State> {
  public state: State = {
    openModal: false,
    bidMask: '',
    bidValue: '',
    secretPhrase: ''
  };

  public toggleModal = () => {
    this.setState({ openModal: !this.state.openModal });
    // this.props.showNotification('danger', 'Bid Mask must be greater than Bid Value', 5000);
  };

  public setMask = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ bidMask: ev.currentTarget.value });
  };

  public setSecret = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ secretPhrase: ev.currentTarget.value });
  };

  public setBidValue = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ bidValue: ev.currentTarget.value });
  };

  public render() {
    const { openModal, bidMask, secretPhrase, bidValue } = this.state;
    const { domainName, title } = this.props;
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{title}</h2>
        <Name value={domainName} />
        <BidValue onChange={this.setBidValue} value={bidValue} />
        <BidMask onChange={this.setMask} value={bidMask} />
        <SecretPhrase onChange={this.setSecret} value={secretPhrase} />
        <GasField />
        <NonceField />
        <GenerateBid
          onComplete={this.toggleModal}
          bidMask={bidMask}
          secret={secretPhrase}
          bidValue={bidValue}
        />
        {/* TODO: should the bid modal have all its data given to it through props, or get it from the redux state itself? */}
        {openModal && <BidModal toggle={this.toggleModal} />}
      </div>
    );
  }
}

export default connect(null, {
  showNotification,
  setCurrentValue
})(PlaceBid);
