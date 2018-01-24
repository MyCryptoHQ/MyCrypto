import React, { Component } from 'react';
import { TShowNotification, showNotification } from 'actions/notifications';
import BidModal from '../../modals/BidModal';
import { connect } from 'react-redux';
import { BidMask, BidValue, Name, SecretPhrase } from './components';
import { GasLimitField, NonceField, GenerateTransaction } from 'components';
import { TInitializeInputs, initializeInputs } from 'actions/ens';

interface DispatchProps {
  showNotification: TShowNotification;
  initializeInputs: TInitializeInputs;
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

  public componentDidMount() {
    this.props.initializeInputs();
  }

  public toggleModal = () => {
    this.setState({ openModal: !this.state.openModal });
    // this.props.showNotification('danger', 'Bid Mask must be greater than Bid Value', 5000);
  };

  public render() {
    const { openModal } = this.state;
    const { title } = this.props;
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{title}</h2>
        <Name />
        <BidValue />
        <BidMask />
        <SecretPhrase />
        <GasLimitField includeLabel={true} onlyIncludeLoader={false} />
        <NonceField alwaysDisplay={false} />
        <GenerateTransaction />
        {/* TODO: should the bid modal have all its data given to it through props, or get it from the redux state itself? */}
        {openModal && <BidModal toggle={this.toggleModal} />}
      </div>
    );
  }
}

export default connect(null, {
  showNotification,
  initializeInputs
})(PlaceBid);
