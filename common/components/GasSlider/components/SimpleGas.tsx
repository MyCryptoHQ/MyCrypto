import React from 'react';
import Slider from 'rc-slider';
import BN from 'bn.js';
import translate from 'translations';
import { gasPriceDefaults } from 'config/data';
import { gasPricetoBase } from 'libs/units';
import FeeSummary from './FeeSummary';
import './SimpleGas.scss';

interface Props {
  gasPrice: string;
  gasLimit: string;
  changeGasPrice(gwei: string): void;
}

export default class SimpleGas extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit } = this.props;

    return (
      <div className="SimpleGas row form-group">
        <div className="col-md-12">
          <label className="SimpleGas-label">{translate('Transaction Fee')}</label>
        </div>

        <div className="col-md-8 col-sm-12">
          <div className="SimpleGas-slider">
            <Slider
              onChange={this.handleSlider}
              min={gasPriceDefaults.gasPriceMinGwei}
              max={gasPriceDefaults.gasPriceMaxGwei}
              value={gasPrice}
            />
            <div className="SimpleGas-slider-labels">
              <span>{translate('Cheap')}</span>
              <span>{translate('Balanced')}</span>
              <span>{translate('Fast')}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="SimpleGas-fee">
            <FeeSummary render={({ feeEth, usd }) => <span>{feeEth}</span>} />
          </div>
        </div>
      </div>
    );
  }

  private handleSlider = (gasGwei: number) => {
    this.props.changeGasPrice(gasGwei.toString());
  };
}
