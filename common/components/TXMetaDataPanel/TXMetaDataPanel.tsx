import React from 'react';
import BN from 'bn.js';
import { translateRaw } from 'translations';
import { connect } from 'react-redux';
import {
  inputGasPrice,
  TInputGasPrice,
  inputGasPriceIntent,
  TInputGasPriceIntent,
  getNonceRequested,
  TGetNonceRequested,
  reset,
  TReset
} from 'actions/transaction';
import { fetchCCRates, TFetchCCRates } from 'actions/rates';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { Units } from 'libs/units';
import SimpleGas from './components/SimpleGas';
import AdvancedGas, { AdvancedOptions } from './components/AdvancedGas';
import './TXMetaDataPanel.scss';
import { getGasPrice } from 'selectors/transaction';

type SliderStates = 'simple' | 'advanced';

interface StateProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  offline: AppState['config']['offline'];
  network: AppState['config']['network'];
}

interface DispatchProps {
  inputGasPrice: TInputGasPrice;
  inputGasPriceIntent: TInputGasPriceIntent;
  fetchCCRates: TFetchCCRates;
  getNonceRequested: TGetNonceRequested;
  reset: TReset;
}

// Set default props for props that can't be truthy or falsy
interface DefaultProps {
  initialState: SliderStates;
}

interface OwnProps {
  initialState?: SliderStates;
  disableToggle?: boolean;
  advancedGasOptions?: AdvancedOptions;
  className?: string;
}

type Props = DispatchProps & OwnProps & StateProps;

interface State {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  sliderState: SliderStates;
}

class TXMetaDataPanel extends React.Component<Props, State> {
  public static defaultProps: DefaultProps = {
    initialState: 'simple'
  };

  public state: State = {
    gasPrice: this.props.gasPrice,
    sliderState: (this.props as DefaultProps).initialState
  };

  public componentDidMount() {
    if (!this.props.offline) {
      this.props.reset();
      this.props.fetchCCRates([this.props.network.unit]);
      this.props.getNonceRequested();
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
    const { offline, disableToggle, advancedGasOptions, className = '' } = this.props;
    const { gasPrice } = this.state;
    const showAdvanced = this.state.sliderState === 'advanced' || offline;
    return (
      <div className={`Gas col-md-12 ${className}`}>
        {showAdvanced ? (
          <AdvancedGas
            gasPrice={gasPrice}
            inputGasPrice={this.props.inputGasPrice}
            options={advancedGasOptions}
          />
        ) : (
          <SimpleGas gasPrice={gasPrice} inputGasPrice={this.handleGasPriceInput} />
        )}

        {!offline &&
          !disableToggle && (
            <div className="help-block">
              <a className="Gas-toggle" onClick={this.toggleAdvanced}>
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
    this.setState({ sliderState: this.state.sliderState === 'advanced' ? 'simple' : 'advanced' });
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
  fetchCCRates,
  getNonceRequested,
  reset
})(TXMetaDataPanel);
