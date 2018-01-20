import React from 'react';
import { translateRaw } from 'translations';
import { connect } from 'react-redux';
import { inputGasPrice, TInputGasPrice } from 'actions/transaction';
import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import SimpleGas from './components/SimpleGas';
import AdvancedGas from './components/AdvancedGas';
import './GasSlider.scss';
import { getGasPrice } from 'selectors/transaction';
import { GasLimitField } from 'components';

interface StateProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  offline: AppState['config']['offline'];
  network: AppState['config']['network'];
}

interface DispatchProps {
  inputGasPrice: TInputGasPrice;
  fetchCCRates: TFetchCCRates;
}

interface OwnProps {
  disableAdvanced?: boolean;
  lockData?: boolean;
}

type Props = DispatchProps & OwnProps & StateProps;

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
    const { offline, disableAdvanced, gasPrice, lockData } = this.props;
    const showAdvanced = (this.state.showAdvanced || offline) && !disableAdvanced;

    return (
      <div className="GasSlider">
        {lockData ? (
          <GasLimitField
            includeLabel={true}
            customLabel={translateRaw('OFFLINE_Step2_Label_4')}
            onlyIncludeLoader={false}
            disabled={lockData}
          />
        ) : showAdvanced ? (
          <AdvancedGas gasPrice={gasPrice} inputGasPrice={this.props.inputGasPrice} />
        ) : (
          <SimpleGas gasPrice={gasPrice} inputGasPrice={this.props.inputGasPrice} />
        )}

        {!offline &&
          !lockData &&
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

function mapStateToProps(state: AppState): StateProps {
  return {
    gasPrice: getGasPrice(state),
    offline: getOffline(state),
    network: getNetworkConfig(state)
  };
}

export default connect(mapStateToProps, {
  inputGasPrice,
  fetchCCRates
})(GasSlider);
