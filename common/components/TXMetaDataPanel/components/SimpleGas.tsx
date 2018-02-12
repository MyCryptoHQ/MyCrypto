import React from 'react';
import Slider from 'rc-slider';
import translate, { translateRaw } from 'translations';
import { gasPriceDefaults } from 'config';
import FeeSummary from './FeeSummary';
import './SimpleGas.scss';
import { AppState } from 'reducers';
import {
  getGasLimitEstimationTimedOut,
  getGasEstimationPending,
  nonceRequestPending
} from 'selectors/transaction';
import { connect } from 'react-redux';
import { getIsWeb3Node } from 'selectors/config';
import { Wei, fromWei } from 'libs/units';
import { InlineSpinner } from 'components/ui/InlineSpinner';
const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  noncePending: boolean;
  gasLimitPending: boolean;
  inputGasPrice(rawGas: string);
  setGasPrice(rawGas: string);
}

interface StateProps {
  isWeb3Node: boolean;
  gasLimitEstimationTimedOut: boolean;
}

type Props = OwnProps & StateProps;

class SimpleGas extends React.Component<Props> {
  public componentDidMount() {
    this.fixGasPrice(this.props.gasPrice);
  }

  public render() {
    const {
      gasPrice,
      gasLimitEstimationTimedOut,
      isWeb3Node,
      noncePending,
      gasLimitPending
    } = this.props;

    return (
      <div className="SimpleGas row form-group">
        <div className="SimpleGas-title">
          <div className="flex-wrapper">
            <label>{translateRaw('Transaction Fee')} </label>
            <div className="flex-spacer" />
            <InlineSpinner active={noncePending || gasLimitPending} text="Calculating" />
          </div>
        </div>

        {gasLimitEstimationTimedOut && (
          <div className="prompt-toggle-gas-limit">
            <p className="small">
              {isWeb3Node
                ? "Couldn't calculate gas limit, if you know what you're doing, try setting manually in Advanced settings"
                : "Couldn't calculate gas limit, try switching nodes"}
            </p>
          </div>
        )}

        <div className="SimpleGas-input-group">
          <div className="SimpleGas-slider">
            <SliderWithTooltip
              onChange={this.handleSlider}
              min={gasPriceDefaults.gasPriceMinGwei}
              max={gasPriceDefaults.gasPriceMaxGwei}
              value={this.getGasPriceGwei(gasPrice.value)}
              tipFormatter={gas => `${gas} Gwei`}
            />
            <div className="SimpleGas-slider-labels">
              <span>{translate('Cheap')}</span>
              <span>{translate('Balanced')}</span>
              <span>{translate('Fast')}</span>
            </div>
          </div>
          <FeeSummary
            gasPrice={gasPrice}
            render={({ fee, usd }) => (
              <span>
                {fee} {usd && <span>/ ${usd}</span>}
              </span>
            )}
          />
        </div>
      </div>
    );
  }

  private handleSlider = (gasGwei: number) => {
    this.props.inputGasPrice(gasGwei.toString());
  };

  private fixGasPrice(gasPrice: AppState['transaction']['fields']['gasPrice']) {
    // If the gas price is above or below our minimum, bring it in line
    const gasPriceGwei = this.getGasPriceGwei(gasPrice.value);
    if (gasPriceGwei > gasPriceDefaults.gasPriceMaxGwei) {
      this.props.setGasPrice(gasPriceDefaults.gasPriceMaxGwei.toString());
    } else if (gasPriceGwei < gasPriceDefaults.gasPriceMinGwei) {
      this.props.setGasPrice(gasPriceDefaults.gasPriceMinGwei.toString());
    }
  }

  private getGasPriceGwei(gasPriceValue: Wei) {
    return parseFloat(fromWei(gasPriceValue, 'gwei'));
  }
}

export default connect((state: AppState) => ({
  noncePending: nonceRequestPending(state),
  gasLimitPending: getGasEstimationPending(state),
  gasLimitEstimationTimedOut: getGasLimitEstimationTimedOut(state),
  isWeb3Node: getIsWeb3Node(state)
}))(SimpleGas);
