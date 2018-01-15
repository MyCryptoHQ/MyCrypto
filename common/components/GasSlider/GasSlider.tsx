import React from 'react';
import { translateRaw } from 'translations';
import { connect } from 'react-redux';
import {
  inputGasPrice,
  TInputGasPrice,
  inputGasLimit,
  TInputGasLimit,
  inputNonce,
  TInputNonce
} from 'actions/transaction';
import { toggleSetGasLimit, TToggleSetGasLimit } from 'actions/config';
import { State as NetworkState } from 'reducers/transaction/network';
import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import { getNetworkConfig, getNode } from 'selectors/config';
import { AppState } from 'reducers';
import SimpleGas from './components/SimpleGas';
import AdvancedGas from './components/AdvancedGas';
import './GasSlider.scss';
import { getNetworkStatus } from 'selectors/transaction';

interface Props {
  // Component configuration
  disableAdvanced?: boolean;
  // Data
  setGasLimit: AppState['config']['setGasLimit'];
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  nonce: AppState['transaction']['fields']['nonce'];
  offline: AppState['config']['offline'];
  network: AppState['config']['network'];
  gasEstimationStatus: NetworkState['gasEstimationStatus'];
  node: AppState['config']['nodeSelection'];
  // Actions
  toggleSetGasLimit: TToggleSetGasLimit;
  inputGasPrice: TInputGasPrice;
  inputGasLimit: TInputGasLimit;
  inputNonce: TInputNonce;
  fetchCCRates: TFetchCCRates;
}

interface State {
  showAdvanced: boolean;
}

class GasSlider extends React.Component<Props, State> {
  public state: State = {
    showAdvanced: false
  };

  public componentDidMount() {
    if (!this.props.offline) {
      this.props.fetchCCRates([this.props.network.unit]);
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.offline && !nextProps.offline) {
      this.props.fetchCCRates([this.props.network.unit]);
    }
  }

  public render() {
    const {
      gasPrice,
      gasLimit,
      nonce,
      offline,
      disableAdvanced,
      gasEstimationStatus,
      setGasLimit,
      node
    } = this.props;
    const showAdvanced = (this.state.showAdvanced || offline) && !disableAdvanced;

    return (
      <div className="GasSlider">
        {showAdvanced ? (
          <AdvancedGas
            gasEstimationStatus={gasEstimationStatus}
            setGasLimit={setGasLimit}
            gasPrice={gasPrice.raw}
            gasLimit={gasLimit.raw}
            nonce={nonce.raw}
            toggleSetGasLimit={this.props.toggleSetGasLimit}
            changeGasPrice={this.props.inputGasPrice}
            changeGasLimit={this.props.inputGasLimit}
            changeNonce={this.props.inputNonce}
          />
        ) : (
          <SimpleGas
            node={node}
            gasPrice={gasPrice.raw}
            gasEstimationStatus={gasEstimationStatus}
            changeGasPrice={this.props.inputGasPrice}
          />
        )}

        {!offline &&
          !disableAdvanced && (
            <div className="help-block">
              <a className="GasSlider-toggle" onClick={this.toggleAdvanced}>
                <strong>
                  {showAdvanced
                    ? `- ${translateRaw('Back to simple')}`
                    : `+ ${translateRaw('Advanced Settings')}`}
                </strong>
              </a>
            </div>
          )}
      </div>
    );
  }

  private toggleAdvanced = () => {
    this.setState({ showAdvanced: !this.state.showAdvanced });
  };
}

function mapStateToProps(state: AppState) {
  return {
    gasPrice: state.transaction.fields.gasPrice,
    gasLimit: state.transaction.fields.gasLimit,
    nonce: state.transaction.fields.nonce,
    offline: state.config.offline,
    setGasLimit: state.config.setGasLimit,
    network: getNetworkConfig(state),
    gasEstimationStatus: getNetworkStatus(state).gasEstimationStatus,
    node: getNode(state)
  };
}

export default connect(mapStateToProps, {
  toggleSetGasLimit,
  inputGasPrice,
  inputGasLimit,
  inputNonce,
  fetchCCRates
})(GasSlider);
