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
}

type Props = OwnProps & DispatchProps;

class PlaceBid extends Component<Props, State> {
  public state: State = {
    openModal: false
  };

  public toggleModal = () => {
    this.setState({ openModal: !this.state.openModal });
    // this.props.showNotification('danger', 'Bid Mask must be greater than Bid Value', 5000);
  };

  public render() {
    const { openModal } = this.state;
    const { domainName, title } = this.props;
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{title}</h2>
        <Name value={domainName} />
        <BidValue />
        <BidMask />
        <SecretPhrase />
        <GasField />
        <NonceField />
        <GenerateBid onComplete={this.toggleModal} />
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
