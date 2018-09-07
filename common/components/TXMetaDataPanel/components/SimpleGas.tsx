import React from 'react';
import { connect } from 'react-redux';
import Slider, { createSliderWithTooltip, Marks } from 'rc-slider';

import { gasPriceDefaults } from 'config';
import translate, { translateRaw } from 'translations';
import { Wei, fromWei } from 'libs/units';
import { AppState } from 'features/reducers';
import { configNodesSelectors } from 'features/config';
import { transactionFieldsActions, transactionNetworkSelectors } from 'features/transaction';
import { gasActions, gasSelectors } from 'features/gas';
import { scheduleSelectors } from 'features/schedule';
import { InlineSpinner } from 'components/ui/InlineSpinner';
import FeeSummary from './FeeSummary';
import './SimpleGas.scss';

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  setGasPrice: transactionFieldsActions.TInputGasPrice;

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
  fetchGasEstimates: gasActions.TFetchGasEstimates;
}

type Props = OwnProps & StateProps & ActionProps;

interface State {
  hasSetRecommendedGasPrice: boolean;
}

interface GasRecommendations {
  [recommendationLevel: string]: number;
}

interface GasTooltips {
  [estimationLevel: string]: string;
}

class SimpleGas extends React.Component<Props> {
  public state: State = {
    hasSetRecommendedGasPrice: false
  };

  public componentDidMount() {
    this.props.fetchGasEstimates();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
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

    const gasNotches = this.makeGasNotches();

    /**
     * @desc On retrieval of gas estimates,
     *  the current gas price may be lower than the lowest recommended price.
     *  `rc-slider` will force the onChange if the value is too low, so we
     *  ensure it at least passes the lower boundary.
     *  When this occurs, the logic in `UNSAFE_componentWillReceiveProps` fires,
     *  and it cannot happen again from that point forward.
     */
    const actualGasPrice = Math.max(this.getGasPriceGwei(gasPrice.value), bounds.min);

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
              marks={gasNotches}
              included={false}
              step={bounds.min < 1 ? 0.1 : 1}
              value={actualGasPrice}
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

  private makeGasNotches = (): Marks => {
    const { gasEstimates } = this.props;

    return gasEstimates
      ? {
          [gasEstimates.safeLow]: '',
          [gasEstimates.standard]: '',
          [gasEstimates.fast]: '',
          [gasEstimates.fastest]: ''
        }
      : {};
  };

  private formatTooltip = (gas: number) => {
    const { gasEstimates } = this.props;

    if (!(gasEstimates && !gasEstimates.isDefault)) {
      return '';
    }

    const gasTooltips: GasTooltips = {
      [gasEstimates.fast]: translateRaw('TX_FEE_RECOMMENDED_FAST'),
      [gasEstimates.fastest]: translateRaw('TX_FEE_RECOMMENDED_FASTEST'),
      [gasEstimates.safeLow]: translateRaw('TX_FEE_RECOMMENDED_SAFELOW'),
      [gasEstimates.standard]: translateRaw('TX_FEE_RECOMMENDED_STANDARD')
    };

    const recommended = gasTooltips[gas] || '';

    return translateRaw('GAS_GWEI_COST', {
      $gas: gas,
      $recommended: recommended
    });
  };
}

export default connect(
  (state: AppState): StateProps => ({
    gasEstimates: gasSelectors.getEstimates(state),
    isGasEstimating: gasSelectors.getIsEstimating(state),
    noncePending: transactionNetworkSelectors.nonceRequestPending(state),
    gasLimitPending: transactionNetworkSelectors.getGasEstimationPending(state),
    gasLimitEstimationTimedOut: transactionNetworkSelectors.getGasLimitEstimationTimedOut(state),
    isWeb3Node: configNodesSelectors.getIsWeb3Node(state),
    scheduleGasPrice: scheduleSelectors.getScheduleGasPrice(state)
  }),
  {
    fetchGasEstimates: gasActions.fetchGasEstimates
  }
)(SimpleGas);
