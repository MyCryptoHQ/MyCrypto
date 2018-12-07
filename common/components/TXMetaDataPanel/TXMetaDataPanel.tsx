import React from 'react';
import { connect } from 'react-redux';
import BN from 'bn.js';

import { translateRaw } from 'translations';
import { NetworkConfig, StaticNetworkConfig } from 'types/network';
import { Units } from 'libs/units';
import { AppState } from 'features/reducers';
import { configSelectors, configMetaSelectors } from 'features/config';
import {
  transactionFieldsActions,
  transactionFieldsSelectors,
  transactionNetworkActions
} from 'features/transaction';
import { ratesActions } from 'features/rates';
import AdvancedGas, { AdvancedOptions } from './components/AdvancedGas';
import SimpleGas from './components/SimpleGas';
import './TXMetaDataPanel.scss';

type SliderStates = 'simple' | 'advanced';

interface StateProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  offline: AppState['config']['meta']['offline'];
  network: NetworkConfig;
}

interface DispatchProps {
  inputGasPrice: transactionFieldsActions.TInputGasPrice;
  inputGasPriceIntent: transactionFieldsActions.TInputGasPriceIntent;
  fetchCCRates: ratesActions.TFetchCCRatesRequested;
  getNonceRequested: transactionNetworkActions.TGetNonceRequested;
  resetTransactionRequested: transactionFieldsActions.TResetTransactionRequested;
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
  const networkConfig = configSelectors.getNetworkConfig(state) as StaticNetworkConfig;
  return {
    gasPrice: networkConfig.isCustom
      ? transactionFieldsSelectors.getGasPrice(state)
      : {
          raw: networkConfig.gasPriceSettings.initial.toString(),
          value: new BN(networkConfig.gasPriceSettings.initial)
        },
    offline: configMetaSelectors.getOffline(state),
    network: configSelectors.getNetworkConfig(state)
  };
}

export default connect(mapStateToProps, {
  inputGasPrice: transactionFieldsActions.inputGasPrice,
  inputGasPriceIntent: transactionFieldsActions.inputGasPriceIntent,
  fetchCCRates: ratesActions.fetchCCRatesRequested,
  getNonceRequested: transactionNetworkActions.getNonceRequested,
  resetTransactionRequested: transactionFieldsActions.resetTransactionRequested
})(TXMetaDataPanel);
