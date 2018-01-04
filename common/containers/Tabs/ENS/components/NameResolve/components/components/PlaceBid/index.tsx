import React, { Component } from 'react';
import { TShowNotification, showNotification } from 'actions/notifications';
import BidModal from '../../modals/BidModal';
import { connect } from 'react-redux';
import { BidMask, Bid, Name, Phrase } from './components';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import networkConfigs from 'libs/ens/networkConfigs';
import { GenerateBid } from 'components/GenerateBid';

interface Props {
  // MapDispatch
  showNotification: TShowNotification;
  setCurrentTo: TSetCurrentTo;
  // Props
  title: string;
  domainName: string;
  buttonName: string;
}

interface State {
  openModal: boolean;
}

class PlaceBid extends Component<Props, State> {
  public state = {
    openModal: false
  };

  public toggleModal = () => {
    this.setState({ openModal: !this.state.openModal });
    // this.props.showNotification('danger', 'Bid Mask must be greater than Bid Value', 5000);
  };

  public componentDidMount() {
    const { ropsten } = networkConfigs;
    // TODO: map current network name to ethauction address
    this.props.setCurrentTo(ropsten.public.ethAuction);
  }

  public render() {
    const { openModal } = this.state;
    const { domainName, title } = this.props;
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{title}</h2>
        <Name value={domainName} />
        <Bid />
        <BidMask />
        <Phrase />
        <GenerateBid onComplete={this.toggleModal} />
        {/* TODO: should the bid modal have all its data given to it through props, or get it from the redux state itself? */}
        {openModal && <BidModal toggle={this.toggleModal} />}
      </div>
    );
  }
}

export default connect(null, {
  setCurrentTo,
  showNotification
})(PlaceBid);
