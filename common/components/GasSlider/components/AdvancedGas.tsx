import React from 'react';
import translate from 'translations';
import { DataFieldFactory } from 'components/DataFieldFactory';
import './AdvancedGas.scss';

interface Props {
  gasPrice: string;
  gasLimit: string;
  changeGasPrice(gwei: string): void;
  changeGasLimit(wei: string): void;
}

export default class AdvancedGas extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit } = this.props;

    return (
      <div className="AdvancedGas row form-group">
        <div className="col-sm-3 col-xs-6">
          <label>{translate('OFFLINE_Step2_Label_3')} (gwei)</label>
          <input className="form-control" value={gasPrice} onChange={this.handleGasPriceChange} />
        </div>

        <div className="col-sm-3 col-xs-6">
          <label>{translate('OFFLINE_Step2_Label_4')}</label>
          <input className="form-control" value={gasLimit} onChange={this.handleGasLimitChange} />
        </div>

        <div className="col-sm-6 col-xs-12">
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
          <div className="AdvancedGas-summary">420000000 * 21000 = 0.00000082 ETH ~= $0.02 USD</div>
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
