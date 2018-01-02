import React, { Component } from 'react';
import { TShowNotification, showNotification } from 'actions/notifications';
import BidModal from '../../modals/BidModal';
import { connect } from 'react-redux';
import { BidMask, Bid, Name, Phrase } from './components';
import { bindActionCreators } from 'redux';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import networkConfigs from 'libs/ens/networkConfigs';
import { GenerateBid } from 'components/GenerateBid';
import EthTx from 'ethereumjs-tx';

interface Props {
  // MapState
  transaction: EthTx;
  // MapDispatch
  showNotification: TShowNotification;
  setCurrentTo: TSetCurrentTo;
  // Props
  title: string;
  name: string;
  buttonName: string;
}

interface State {
  openModal: boolean;
  bidMask: any;
  phrase: string;
}

class PlaceBid extends Component<Props, State> {
  public state = {
    openModal: false,
    bidMask: '',
    phrase: ''
  };

  public toggleModal = () => {
    this.setState({ openModal: !this.state.openModal });
    // this.props.showNotification('danger', 'Bid Mask must be greater than Bid Value', 5000);
  };

  public onClick = () => {
    this.toggleModal();
  };

  public componentDidMount() {
    const { ropsten } = networkConfigs;
    // TODO: map current network name to ethauction address
    this.props.setCurrentTo(ropsten.public.ethAuction);
  }

  public setBidMask = bidMask => {
    this.setState({
      bidMask
    });
  };

  public setPhrase = phrase => {
    this.setState({ phrase });
  };

  public render() {
    const { openModal, bidMask, phrase } = this.state;
    const { name, title } = this.props;
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{title}</h2>
        <Name value={name} />
        <Bid />
        <BidMask onChange={this.setBidMask} />
        <Phrase onChange={this.setPhrase} />
        <GenerateBid onComplete={this.toggleModal} />
        {openModal && (
          <BidModal name={name} toggle={this.toggleModal} mask={bidMask} phrase={phrase} />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setCurrentTo, showNotification }, dispatch);
};

export default connect(null, mapDispatchToProps)(PlaceBid);
