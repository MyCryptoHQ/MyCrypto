import React from 'react';
import classnames from 'classnames';
import translate from 'translations';
import FeeSummary from './FeeSummary';
import './AdvancedGas.scss';
import { TToggleAutoGasLimit, toggleAutoGasLimit } from 'actions/config';
import { AppState } from 'reducers';
import { TInputGasPrice } from 'actions/transaction';
import { NonceField, GasLimitField, DataField } from 'components';
import { connect } from 'react-redux';
import { getAutoGasLimitEnabled } from 'selectors/config';

interface OwnProps {
  inputGasPrice: TInputGasPrice;
  gasPrice: AppState['transaction']['fields']['gasPrice'];
}

interface StateProps {
  autoGasLimitEnabled: AppState['config']['autoGasLimit'];
}

interface DispatchProps {
  toggleAutoGasLimit: TToggleAutoGasLimit;
}

type Props = OwnProps & StateProps & DispatchProps;

class AdvancedGas extends React.Component<Props> {
  public render() {
    const { autoGasLimitEnabled, gasPrice } = this.props;
    return (
      <div className="AdvancedGas row form-group">
        <div className="col-md-12">
          <label className="checkbox">
            <input
              type="checkbox"
              defaultChecked={autoGasLimitEnabled}
              onChange={this.handleToggleAutoGasLimit}
            />
            <span>Automatically Calculate Gas Limit</span>
          </label>
        </div>

        <div className="col-md-4 col-sm-6 col-xs-12">
          <label>{translate('OFFLINE_Step2_Label_3')} (gwei)</label>
          <input
            className={classnames('form-control', { 'is-invalid': !gasPrice.value })}
            type="number"
            placeholder="e.g. 40"
            value={gasPrice.raw}
            onChange={this.handleGasPriceChange}
          />
        </div>

        <div className="col-md-4 col-sm-6 col-xs-12 AdvancedGas-gasLimit">
          <label>{translate('OFFLINE_Step2_Label_4')}</label>
          <div className="SimpleGas-flex-spacer" />
          <GasLimitField includeLabel={false} onlyIncludeLoader={false} />
        </div>

        <div className="col-md-4 col-sm-12">
          <NonceField alwaysDisplay={true} />
        </div>

        <div className="col-md-12">
          <DataField />
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
    this.props.inputGasPrice(ev.currentTarget.value);
  };

  private handleToggleAutoGasLimit = (_: React.FormEvent<HTMLInputElement>) => {
    this.props.toggleAutoGasLimit();
  };
}

export default connect(
  (state: AppState) => ({ autoGasLimitEnabled: getAutoGasLimitEnabled(state) }),
  { toggleAutoGasLimit }
)(AdvancedGas);
