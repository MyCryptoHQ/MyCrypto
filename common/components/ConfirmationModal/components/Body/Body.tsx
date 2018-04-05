import { Addresses } from './components/Addresses';
import { Amounts } from './components/Amounts';
import { Details } from './components/Details';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import './Body.scss';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';
import translate from 'translations';

interface State {
  showDetails: boolean;
}

interface StateProps {
  network: NetworkConfig;
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
    network: getNetworkConfig(state)
  };
};

export const Body = connect(mapStateToProps)(BodyClass);
