import React from 'react';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import translate from 'translations';
import './SimpleGas.scss';
import { AppState } from 'reducers';
import {
  getGasLimitEstimationTimedOut,
  getGasEstimationPending,
  nonceRequestPending
} from 'selectors/transaction';
import { connect } from 'react-redux';
import { fetchGasEstimates, TFetchGasEstimates } from 'actions/gas';
import { getIsWeb3Node } from 'selectors/config';
import { getEstimates, getIsEstimating } from 'selectors/gas';
import { Wei, fromWei } from 'libs/units';
import { gasPriceDefaults } from 'config';
import { InlineSpinner } from 'components/ui/InlineSpinner';
import { TInputGasPrice } from 'actions/transaction';
import FeeSummary from './FeeSummary';
import { getScheduleGasPrice } from 'selectors/schedule';

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  setGasPrice: TInputGasPrice;

  inputGasPrice(rawGas: string): void;
}

interface StateProps {
  gasEstimates: AppState['gas']['estimates'];
  isGasEstimating: AppState['gas']['isEstimating'];
  noncePending: boolean;
  gasLimitPending: boolean;
  isWeb3Node: boolean;
  gasLimitEstimationTimedOut: boolean;
  scheduleGasPrice: AppState['schedule']['scheduleGasPrice'];
}

interface ActionProps {
  fetchGasEstimates: TFetchGasEstimates;
}

type Props = OwnProps & StateProps & ActionProps;

interface State {
  hasSetRecommendedGasPrice: boolean;
}

class SimpleGas extends React.Component<Props> {
  public state: State = {
    hasSetRecommendedGasPrice: false
  };

  public componentDidMount() {
    this.props.fetchGasEstimates();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!this.state.hasSetRecommendedGasPrice && nextProps.gasEstimates) {
      this.setState({ hasSetRecommendedGasPrice: true });
      this.props.setGasPrice(nextProps.gasEstimates.fast.toString());
    }
  }

  public render() {
    const {
      isGasEstimating,
      gasEstimates,
      gasPrice,
      gasLimitEstimationTimedOut,
      isWeb3Node,
      noncePending,
      gasLimitPending,
      scheduleGasPrice
    } = this.props;

    const bounds = {
      max: gasEstimates ? gasEstimates.fastest : gasPriceDefaults.max,
      min: gasEstimates ? gasEstimates.safeLow : gasPriceDefaults.min
    };

    return (
      <div className="SimpleGas row form-group">
        <div className="SimpleGas-title">
          <div className="flex-wrapper">
            <label>{translate('CONFIRM_TX_FEE')} </label>
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
              min={bounds.min}
              max={bounds.max}
              step={bounds.min < 1 ? 0.1 : 1}
              value={this.getGasPriceGwei(gasPrice.value)}
              tipFormatter={this.formatTooltip}
              disabled={isGasEstimating}
            />
            <div className="SimpleGas-slider-labels">
              <span>{translate('TX_FEE_SCALE_LEFT')}</span>
              <span>{translate('TX_FEE_SCALE_RIGHT')}</span>
            </div>
          </div>
          <FeeSummary
            gasPrice={gasPrice}
            scheduleGasPrice={scheduleGasPrice}
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

  private getGasPriceGwei(gasPriceValue: Wei) {
    return parseFloat(fromWei(gasPriceValue, 'gwei'));
  }

  private formatTooltip = (gas: number) => {
    const { gasEstimates } = this.props;
    let recommended = '';
    if (gasEstimates && !gasEstimates.isDefault && gas === gasEstimates.fast) {
      recommended = '(Recommended)';
    }

    return `${gas} Gwei ${recommended}`;
  };
}

export default connect(
  (state: AppState): StateProps => ({
    gasEstimates: getEstimates(state),
    isGasEstimating: getIsEstimating(state),
    noncePending: nonceRequestPending(state),
    gasLimitPending: getGasEstimationPending(state),
    gasLimitEstimationTimedOut: getGasLimitEstimationTimedOut(state),
    isWeb3Node: getIsWeb3Node(state),
    scheduleGasPrice: getScheduleGasPrice(state)
  }),
  {
    fetchGasEstimates
  }
)(SimpleGas);
