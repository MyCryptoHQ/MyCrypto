import React from 'react';
import BN from 'bn.js';
import { connect } from 'react-redux';
import {
  inputGasPrice,
  TInputGasPrice,
  inputGasPriceIntent,
  TInputGasPriceIntent,
  getNonceRequested,
  TGetNonceRequested,
  resetTransactionRequested,
  TResetTransactionRequested
} from 'actions/transaction';
import { fetchCCRatesRequested, TFetchCCRatesRequested } from 'actions/rates';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { Units } from 'libs/units';
import SimpleGas from './components/SimpleGas';
import AdvancedGas, { AdvancedOptions } from './components/AdvancedGas';
import './TXMetaDataPanel.scss';
import { getGasPrice } from 'selectors/transaction';
import { NetworkConfig } from 'types/network';
import { translateRaw } from 'translations';

type SliderStates = 'simple' | 'advanced';

interface StateProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  offline: AppState['config']['meta']['offline'];
  network: NetworkConfig;
}

interface DispatchProps {
  inputGasPrice: TInputGasPrice;
  inputGasPriceIntent: TInputGasPriceIntent;
  fetchCCRates: TFetchCCRatesRequested;
  getNonceRequested: TGetNonceRequested;
  resetTransactionRequested: TResetTransactionRequested;
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
  scheduling?: boolean;
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

  public componentWillMount() {
    if (!this.props.offline) {
      this.props.resetTransactionRequested();
    }
  }

  public componentDidMount() {
    if (!this.props.offline) {
      this.props.fetchCCRates([this.props.network.unit]);
      this.props.getNonceRequested();
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      (this.props.offline && !nextProps.offline) ||
      this.props.network.unit !== nextProps.network.unit
    ) {
      this.props.fetchCCRates([this.props.network.unit]);
    }
    if (this.props.gasPrice !== nextProps.gasPrice) {
      this.setState({ gasPrice: nextProps.gasPrice });
    }
  }

  public render() {
    const { offline, disableToggle, advancedGasOptions, className = '', scheduling } = this.props;
    const { gasPrice } = this.state;
    const showAdvanced = this.state.sliderState === 'advanced' || offline;

    return (
      <div className={`Gas col-md-12 ${className}`}>
        <br />
        {showAdvanced ? (
          <AdvancedGas
            gasPrice={gasPrice}
            inputGasPrice={this.props.inputGasPrice}
            options={advancedGasOptions}
            scheduling={scheduling}
          />
        ) : (
          <SimpleGas
            gasPrice={gasPrice}
            inputGasPrice={this.handleGasPriceInput}
            setGasPrice={this.props.inputGasPrice}
          />
        )}

        {!offline &&
          !disableToggle && (
            <div className="help-block">
              <a className="Gas-toggle" onClick={this.toggleAdvanced}>
                {showAdvanced
                  ? `- ${translateRaw('TRANS_SIMPLE')}`
                  : `+ ${translateRaw('TRANS_ADVANCED')}`}
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
    // Realistically, we're not going to end up with a > 32 bit int, so it's
    // safe to cast to float, multiply by gwei units, then big number, since
    // some of the inputs may be sub-one float values.
    const value = new BN(parseFloat(raw) * parseFloat(Units.gwei));
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
  fetchCCRates: fetchCCRatesRequested,
  getNonceRequested,
  resetTransactionRequested
})(TXMetaDataPanel);
