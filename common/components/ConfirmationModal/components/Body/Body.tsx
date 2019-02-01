import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { Addresses } from './components/Addresses';
import { Amounts } from './components/Amounts';
import { Details } from './components/Details';
import './Body.scss';
import { scheduleSelectors } from 'features/schedule';
import * as selectors from 'features/selectors';

interface State {
  showDetails: boolean;
}

interface StateProps {
  isToken: boolean;
  isSchedulingEnabled: boolean;
  network: NetworkConfig;
  sendingTokenApproveTransaction: boolean;
}

class BodyClass extends React.Component<StateProps, State> {
  public state: State = {
    showDetails: false
  };

  public toggleDetails = () => {
    this.setState({
      showDetails: !this.state.showDetails
    });
  };

  public render() {
    const { showDetails } = this.state;

    return (
      <div className="tx-modal-body">
        {this.props.network.isTestnet && (
          <p className="tx-modal-testnet-warn small">Testnet Transaction</p>
        )}
        {this.props.isSchedulingEnabled &&
          this.props.isToken && (
            <p className="tx-modal-testnet-warn small">
              {translate('SCHEDULE_TOKEN_TRANSFER_NOTICE')}
            </p>
          )}

        {this.props.sendingTokenApproveTransaction && (
          <p className="tx-modal-testnet-warn small">
            {translate('SCHEDULE_TOKEN_TRANSFER_APPROVE')}
          </p>
        )}

        <Addresses />
        <Amounts />
        <button
          className={`tx-modal-details-button ${
            showDetails ? 'tx-modal-details-button--open' : ''
          }`}
          onClick={this.toggleDetails}
        >
          {translate('ACTION_8')}
        </button>
        {showDetails && <Details />}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => {
  return {
    isSchedulingEnabled: scheduleSelectors.isSchedulingEnabled(state),
    isToken: !selectors.isEtherTransaction(state),
    network: configSelectors.getNetworkConfig(state),
    sendingTokenApproveTransaction: scheduleSelectors.getSendingTokenApproveTransaction(state)
  };
};

export const Body = connect(mapStateToProps)(BodyClass);
