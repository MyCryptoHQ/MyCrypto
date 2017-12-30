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
import { AppState } from 'reducers';
import SimpleGas from './components/SimpleGas';
import AdvancedGas from './components/AdvancedGas';
import './GasSlider.scss';

interface Props {
  // Data
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  offline: AppState['config']['offline'];
  // Actions
  inputGasPrice: TInputGasPrice;
  inputGasLimit: TInputGasLimit;
  inputNonce: TInputNonce;
}

interface State {
  showAdvanced: boolean;
}

class GasSlider extends React.Component<Props, State> {
  public state: State = {
    showAdvanced: false
  };

  public render() {
    const { gasPrice, gasLimit, offline } = this.props;
    const showAdvanced = this.state.showAdvanced || offline;

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
          <SimpleGas
            gasPrice={gasPrice.raw}
            gasLimit={gasLimit.raw}
            changeGasPrice={this.props.inputGasPrice}
          />
        )}

        {!offline && (
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
    offline: state.config.offline
  };
}

export default connect(mapStateToProps, {
  inputGasPrice,
  inputGasLimit,
  inputNonce
})(GasSlider);
