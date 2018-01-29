import React from 'react';
import Slider from 'rc-slider';
import translate, { translateRaw } from 'translations';
import { gasPriceDefaults } from 'config';
import FeeSummary from './FeeSummary';
import './SimpleGas.scss';
import { AppState } from 'reducers';
import { getGasLimitEstimationTimedOut } from 'selectors/transaction';
import { connect } from 'react-redux';
import { GasLimitField } from 'components/GasLimitField';
import { getIsWeb3Node } from 'selectors/config';

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  inputGasPrice(rawGas: string);
}

interface StateProps {
  isWeb3Node: boolean;
  gasLimitEstimationTimedOut: boolean;
}

type Props = OwnProps & StateProps;

class SimpleGas extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimitEstimationTimedOut, isWeb3Node } = this.props;

    return (
      <div className="SimpleGas row form-group">
        <div className="SimpleGas-title">
          <GasLimitField
            includeLabel={true}
            customLabel={translateRaw('Transaction Fee')}
            onlyIncludeLoader={true}
          />
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
            <Slider
              onChange={this.handleSlider}
              min={gasPriceDefaults.gasPriceMinGwei}
              max={gasPriceDefaults.gasPriceMaxGwei}
              value={parseFloat(gasPrice.raw)}
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
}
export default connect((state: AppState) => ({
  gasLimitEstimationTimedOut: getGasLimitEstimationTimedOut(state),
  isWeb3Node: getIsWeb3Node(state)
}))(SimpleGas);
