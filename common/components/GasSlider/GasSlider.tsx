import React from 'react';
import BN from 'bn.js';
import { translateRaw } from 'translations';
import { connect } from 'react-redux';
import {
  inputGasPrice,
  TInputGasPrice,
  inputGasPriceIntent,
  TInputGasPriceIntent
} from 'actions/transaction';
import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { Units } from 'libs/units';
import SimpleGas from './components/SimpleGas';
import AdvancedGas from './components/AdvancedGas';
import './GasSlider.scss';
import { getGasPrice } from 'selectors/transaction';

interface StateProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  offline: AppState['config']['offline'];
  network: AppState['config']['network'];
}

interface DispatchProps {
  inputGasPrice: TInputGasPrice;
  inputGasPriceIntent: TInputGasPriceIntent;
  fetchCCRates: TFetchCCRates;
}

interface OwnProps {
  disableAdvanced?: boolean;
}

type Props = DispatchProps & OwnProps & StateProps;

interface State {
  showAdvanced: boolean;
  gasPrice: AppState['transaction']['fields']['gasPrice'];
}

class GasSlider extends React.Component<Props, State> {
  public state: State = {
    showAdvanced: false,
    gasPrice: this.props.gasPrice
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
    if (this.props.gasPrice !== nextProps.gasPrice) {
      this.setState({ gasPrice: nextProps.gasPrice });
    }
  }

  public render() {
    const { offline, disableAdvanced } = this.props;
    const { gasPrice } = this.state;
    const showAdvanced = (this.state.showAdvanced || offline) && !disableAdvanced;

    return (
      <div className="GasSlider">
        {showAdvanced ? (
          <AdvancedGas gasPrice={gasPrice} inputGasPrice={this.props.inputGasPrice} />
        ) : (
          <SimpleGas gasPrice={gasPrice} inputGasPrice={this.handleGasPriceInput} />
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

  private handleGasPriceInput = (raw: string) => {
    const gasBn = new BN(raw);
    const value = gasBn.mul(new BN(Units.gwei));
    this.setState({
      gasPrice: { raw, value }
    });
    this.props.inputGasPriceIntent(raw);
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
  inputGasPriceIntent,
  fetchCCRates
})(GasSlider);
