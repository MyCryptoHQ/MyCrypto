import React from 'react';
import Slider from 'rc-slider';
import translate from 'translations';
import { gasPriceDefaults } from 'config/data';
import FeeSummary from './FeeSummary';
import { Spinner } from 'components/ui';
import { CSSTransition } from 'react-transition-group';
import { State as NetworkState } from 'reducers/transaction/network';
import './SimpleGas.scss';

interface Props {
  gasPrice: string;
  gasEstimationStatus: NetworkState['gasEstimationStatus'];
  changeGasPrice(gwei: string): void;
}

export default class SimpleGas extends React.Component<Props> {
  public render() {
    const { gasPrice, gasEstimationStatus } = this.props;
    const estimatingGas = gasEstimationStatus === 'PENDING' ? true : false;
    const estimatingGasTimeout = gasEstimationStatus === 'TIMEOUT' ? true : false;
    return (
      <div className="SimpleGas row form-group">
        <div className="col-md-12 SimpleGas-title">
          <label className="SimpleGas-label">{translate('Transaction Fee')}</label>
          <div className="SimpleGas-flex-spacer" />
          <CSSTransition in={estimatingGas} timeout={300} classNames="fade">
            <div className={`SimpleGas-estimating small ${estimatingGas ? 'active' : ''}`}>
              Setting gas limit
              <Spinner />
            </div>
          </CSSTransition>
        </div>
        {estimatingGasTimeout && (
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
              value={parseFloat(gasPrice)}
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
    this.props.changeGasPrice(gasGwei.toString());
  };
}
