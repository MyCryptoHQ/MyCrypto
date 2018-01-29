import React, { Component } from 'react';
import { TShowNotification, showNotification } from 'actions/notifications';
import { connect } from 'react-redux';
import { BidMask, BidValue, Name, SecretPhrase, BidModal } from './components';
import { GasLimitField, NonceField, GenerateTransaction, SendButton } from 'components';
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

type Props = OwnProps & DispatchProps;

class PlaceBid extends Component<Props> {
  public componentDidMount() {
    this.props.initializeInputs();
  }

  public render() {
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
        <SendButton customModal={BidModal} />
      </div>
    );
  }
}

export default connect(null, {
  showNotification,
  initializeInputs
})(PlaceBid);
