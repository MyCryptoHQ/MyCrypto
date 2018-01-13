import React from 'react';
import classnames from 'classnames';
import translate from 'translations';
import { DataFieldFactory } from 'components/DataFieldFactory';
import FeeSummary from './FeeSummary';
import { Spinner } from 'components/ui';
import { CSSTransition } from 'react-transition-group';
import { State as NetworkState } from 'reducers/transaction/network';
import './AdvancedGas.scss';

interface Props {
  gasEstimationStatus: NetworkState['gasEstimationStatus'];
  setGasLimit: boolean;
  gasPrice: string;
  gasLimit: string;
  nonce: string;
  toggleSetGasLimit(bool: boolean): void;
  changeGasPrice(gwei: string): void;
  changeGasLimit(wei: string): void;
  changeNonce(nonce: string): void;
}

export default class AdvancedGas extends React.Component<Props> {
  public render() {
    // Shadow var names on gasLimit
    const { gasEstimationStatus, setGasLimit, gasPrice, nonce } = this.props;
    const estimatingGas = gasEstimationStatus === 'PENDING' ? true : false;
    return (
      <div className="AdvancedGas row form-group">
        <div className="col-md-12">
          <label className="checkbox">
            <input
              type="checkbox"
              className="form-check-input"
              defaultChecked={setGasLimit}
              onChange={this.handleToggleSetGasLimit}
            />
            <span>Automatically Set Gas Limit</span>
          </label>
        </div>

        <div className="col-md-4 col-sm-6 col-xs-12">
          <label>{translate('OFFLINE_Step2_Label_3')} (gwei)</label>
          <input
            className={classnames('form-control', !gasPrice && 'is-invalid')}
            type="number"
            placeholder="e.g. 40"
            value={gasPrice}
            onChange={this.handleGasPriceChange}
          />
        </div>

        <div className="col-md-4 col-sm-6 col-xs-12 gasLimit-input-grp">
          <label>{translate('OFFLINE_Step2_Label_4')}</label>
          <div className="SimpleGas-flex-spacer" />
          <CSSTransition in={estimatingGas} timeout={300} classNames="fade">
            <div className={`SimpleGas-estimating small ${estimatingGas ? 'active' : ''}`}>
              Setting gas limit
              <Spinner />
            </div>
          </CSSTransition>
          <input
            className={classnames('form-control', !this.props.gasLimit && 'is-invalid')}
            type="number"
            placeholder="e.g. 21000"
            value={this.props.gasLimit}
            onChange={this.handleGasLimitChange}
          />
        </div>

        <div className="col-md-4 col-sm-12">
          <label>{translate('OFFLINE_Step2_Label_5')}</label>
          <input
            className={classnames('form-control', !nonce && 'is-invalid')}
            type="number"
            placeholder="e.g. 7"
            value={nonce}
            onChange={this.handleNonceChange}
          />
        </div>

        <div className="col-md-12">
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

  private handleNonceChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.changeNonce(ev.currentTarget.value);
  };

  private handleToggleSetGasLimit = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.toggleSetGasLimit(!ev.currentTarget.checked);
  };
}
