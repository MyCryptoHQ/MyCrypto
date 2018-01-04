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
import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import { getNetworkConfig } from 'selectors/config';
import { AppState } from 'reducers';
import SimpleGas from './components/SimpleGas';
import AdvancedGas from './components/AdvancedGas';
import './GasSlider.scss';

interface Props {
  // Component configuration
  disableAdvanced?: boolean;
  // Data
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  offline: AppState['config']['offline'];
  network: AppState['config']['network'];
  // Actions
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
    this.props.fetchCCRates([this.props.network.unit]);
  }

  public render() {
    const { gasPrice, gasLimit, offline, disableAdvanced } = this.props;
    const showAdvanced = (this.state.showAdvanced || offline) && !disableAdvanced;

    return (
      <div className="GasSlider">
        {showAdvanced ? (
          <AdvancedGas
            gasPrice={gasPrice.raw}
            gasLimit={gasLimit.raw}
            changeGasPrice={this.props.inputGasPrice}
            changeGasLimit={this.props.inputGasLimit}
          />
        ) : (
          <SimpleGas gasPrice={gasPrice.raw} changeGasPrice={this.props.inputGasPrice} />
        )}

        {!offline &&
          !disableAdvanced && (
            <div className="help-block">
              <a className="GasSlider-toggle" onClick={this.toggleAdvanced}>
                <strong>
                  {showAdvanced
                    ? `- ${translateRaw('Back to simple')}`
                    : `+ ${translateRaw('Advanced: Data, Gas Price, Gas Limit')}`}
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
    offline: state.config.offline,
    network: getNetworkConfig(state)
  };
}

export default connect(mapStateToProps, {
  inputGasPrice,
  inputGasLimit,
  inputNonce,
  fetchCCRates
})(GasSlider);
