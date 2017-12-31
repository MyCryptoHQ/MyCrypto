import React from 'react';
import translate from 'translations';
import { DataFieldFactory } from 'components/DataFieldFactory';
import FeeSummary from './FeeSummary';
import './AdvancedGas.scss';

interface Props {
  gasPrice: string;
  gasLimit: string;
  changeGasPrice(gwei: string): void;
  changeGasLimit(wei: string): void;
}

export default class AdvancedGas extends React.Component<Props> {
  public render() {
    return (
      <div className="AdvancedGas row form-group">
        <div className="col-md-3 col-sm-6 col-xs-12">
          <label>{translate('OFFLINE_Step2_Label_3')} (gwei)</label>
          <input
            className="form-control"
            value={this.props.gasPrice}
            onChange={this.handleGasPriceChange}
          />
        </div>

        <div className="col-md-3 col-sm-6 col-xs-12">
          <label>{translate('OFFLINE_Step2_Label_4')}</label>
          <input
            className="form-control"
            value={this.props.gasLimit}
            onChange={this.handleGasLimitChange}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <label>{translate('OFFLINE_Step2_Label_6')}</label>
          <DataFieldFactory
            withProps={({ data, onChange }) => (
              <input
                className="form-control"
                value={data.raw}
                onChange={onChange}
                placeholder="0x7cB57B5A..."
              />
            )}
          />
        </div>

        <div className="col-sm-12">
          <FeeSummary
            render={({ gasPriceWei, gasLimit, fee, usd }) => (
              <span>
                {gasPriceWei} * {gasLimit} = {fee} {usd && <span>~= ${usd} USD</span>}
              </span>
            )}
          />
        </div>
      </div>
    );
  }

  private handleGasPriceChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.changeGasPrice(ev.currentTarget.value);
  };

  private handleGasLimitChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.changeGasLimit(ev.currentTarget.value);
  };
}
