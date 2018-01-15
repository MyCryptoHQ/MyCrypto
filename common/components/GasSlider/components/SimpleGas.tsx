import React from 'react';
import Slider from 'rc-slider';
import translate from 'translations';
import { gasPriceDefaults } from 'config/data';
import FeeSummary from './FeeSummary';
import { TInputGasPrice } from 'actions/transaction';
import './SimpleGas.scss';
import { AppState } from 'reducers';
import { getGasLimitEstimationTimedOut } from 'selectors/transaction';
import { connect } from 'react-redux';
import { GasLimitField } from 'components/GasLimitField';

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  inputGasPrice: TInputGasPrice;
}

interface StateProps {
  gasLimitEstimationTimedOut: boolean;
}

type Props = OwnProps & StateProps;

class SimpleGas extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimitEstimationTimedOut } = this.props;

    return (
      <div className="SimpleGas row form-group">
        <div className="col-md-12 SimpleGas-title">
          <label className="SimpleGas-label">{translate('Transaction Fee')}</label>
          <div className="SimpleGas-flex-spacer" />
          <GasLimitField includeLabel={false} onlyIncludeLoader={true} />
        </div>

        {gasLimitEstimationTimedOut && (
          <div className="col-md-12 prompt-toggle-gas-limit">
            <p className="small">
              Couldn't set gas limit, try setting manually in advanced settings
            </p>
          </div>
        )}

        <div className="col-md-8 col-sm-12">
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
        </div>
        <div className="col-md-4 col-sm-12">
          <FeeSummary
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
  gasLimitEstimationTimedOut: getGasLimitEstimationTimedOut(state)
}))(SimpleGas);
