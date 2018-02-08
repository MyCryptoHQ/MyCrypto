import React from 'react';
import classnames from 'classnames';
import translate, { translateRaw } from 'translations';
import FeeSummary from './FeeSummary';
import './AdvancedGas.scss';
import { TToggleAutoGasLimit, toggleAutoGasLimit } from 'actions/config';
import { AppState } from 'reducers';
import { TInputGasPrice } from 'actions/transaction';
import { NonceField, GasLimitField, DataField } from 'components';
import { connect } from 'react-redux';
import { getAutoGasLimitEnabled } from 'selectors/config';
import { isValidGasPrice } from 'selectors/transaction';
import { sanitizeNumericalInput } from 'libs/values';

export interface AdvancedOptions {
  gasPriceField?: boolean;
  gasLimitField?: boolean;
  nonceField?: boolean;
  dataField?: boolean;
  feeSummary?: boolean;
}

interface OwnProps {
  inputGasPrice: TInputGasPrice;
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  options?: AdvancedOptions;
}

interface StateProps {
  autoGasLimitEnabled: AppState['config']['autoGasLimit'];
  validGasPrice: boolean;
}

interface DispatchProps {
  toggleAutoGasLimit: TToggleAutoGasLimit;
}

interface State {
  options: AdvancedOptions;
}

type Props = OwnProps & StateProps & DispatchProps;

class AdvancedGas extends React.Component<Props, State> {
  public state = {
    options: {
      gasPriceField: true,
      gasLimitField: true,
      nonceField: true,
      dataField: true,
      feeSummary: true,
      ...this.props.options
    }
  };

  public render() {
    const { autoGasLimitEnabled, gasPrice, validGasPrice } = this.props;
    const { gasPriceField, gasLimitField, nonceField, dataField, feeSummary } = this.state.options;
    return (
      <div className="AdvancedGas row form-group">
        <div className="AdvancedGas-calculate-limit">
          <label className="checkbox">
            <input
              type="checkbox"
              defaultChecked={autoGasLimitEnabled}
              onChange={this.handleToggleAutoGasLimit}
            />
            <span>Automatically Calculate Gas Limit</span>
          </label>
        </div>

        <div className="AdvancedGas-flex-wrapper flex-wrapper">
          {gasPriceField && (
            <div className="AdvancedGas-gas-price">
              <label>{translate('OFFLINE_Step2_Label_3')} (gwei)</label>
              <input
                className={classnames('form-control', {
                  'is-invalid': !!gasPrice.raw && !validGasPrice
                })}
                type="number"
                placeholder="40"
                value={gasPrice.raw}
                onChange={this.handleGasPriceChange}
              />
            </div>
          )}

          {gasLimitField && (
            <div className="AdvancedGas-gas-limit">
              <GasLimitField
                includeLabel={true}
                customLabel={translateRaw('OFFLINE_Step2_Label_4')}
                onlyIncludeLoader={false}
              />
            </div>
          )}
          {nonceField && (
            <div className="AdvancedGas-nonce">
              <NonceField alwaysDisplay={true} />
            </div>
          )}
        </div>

        {dataField && (
          <div className="AdvancedGas-data">
            <DataField />
          </div>
        )}

        {feeSummary && (
          <div className="AdvancedGas-fee-summary">
            <FeeSummary
              gasPrice={gasPrice}
              render={({ gasPriceWei, gasLimit, fee, usd }) => (
                <span>
                  {gasPriceWei} * {gasLimit} = {fee} {usd && <span>~= ${usd} USD</span>}
                </span>
              )}
            />
          </div>
        )}
      </div>
    );
  }

  private handleGasPriceChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputGasPrice(sanitizeNumericalInput(value));
  };

  private handleToggleAutoGasLimit = (_: React.FormEvent<HTMLInputElement>) => {
    this.props.toggleAutoGasLimit();
  };
}

export default connect(
  (state: AppState) => ({
    autoGasLimitEnabled: getAutoGasLimitEnabled(state),
    validGasPrice: isValidGasPrice(state)
  }),
  { toggleAutoGasLimit }
)(AdvancedGas);
