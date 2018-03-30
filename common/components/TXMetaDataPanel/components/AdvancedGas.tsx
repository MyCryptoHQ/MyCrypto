import React from 'react';
import { translateRaw } from 'translations';
import FeeSummary from './FeeSummary';
import './AdvancedGas.scss';
import { TToggleAutoGasLimit, toggleAutoGasLimit } from 'actions/config';
import { AppState } from 'reducers';
import { TInputGasPrice } from 'actions/transaction';
import { NonceField, GasLimitField, DataField } from 'components';
import { connect } from 'react-redux';
import { getAutoGasLimitEnabled } from 'selectors/config';
import { isValidGasPrice, getTimeBounty, getScheduleGasPrice } from 'selectors/transaction';
import { sanitizeNumericalInput } from 'libs/values';
import { Input, UnitDisplay } from 'components/ui';
import SchedulingFeeSummary from './SchedulingFeeSummary';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

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
  scheduling?: boolean;
  scheduleGasPrice: AppState['transaction']['fields']['scheduleGasPrice'];
  timeBounty: AppState['transaction']['fields']['timeBounty'];
}

interface StateProps {
  autoGasLimitEnabled: AppState['config']['meta']['autoGasLimit'];
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
    const { autoGasLimitEnabled, gasPrice, scheduling, validGasPrice } = this.props;
    const { gasPriceField, gasLimitField, nonceField, dataField } = this.state.options;

    return (
      <div className="AdvancedGas row form-group">
        {!scheduling && (
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
        )}

        <div className="AdvancedGas-flex-wrapper flex-wrapper">
          {gasPriceField && (
            <div className="AdvancedGas-gas-price">
              <div className="input-group-wrapper">
                <label className="input-group">
                  <div className="input-group-header">
                    {translateRaw('OFFLINE_STEP2_LABEL_3')} (gwei)
                  </div>
                  <Input
                    className={!!gasPrice.raw && !validGasPrice ? 'invalid' : ''}
                    type="number"
                    placeholder="40"
                    value={gasPrice.raw}
                    onChange={this.handleGasPriceChange}
                  />
                </label>
              </div>
            </div>
          )}

          {gasLimitField && (
            <div className="AdvancedGas-gas-limit">
              <GasLimitField
                customLabel={translateRaw('OFFLINE_STEP2_LABEL_4')}
                disabled={scheduling}
              />
            </div>
          )}
          {nonceField && (
            <div className="AdvancedGas-nonce">
              <NonceField alwaysDisplay={true} />
            </div>
          )}
        </div>

        {dataField &&
          !scheduling && (
            <div className="AdvancedGas-data">
              <DataField />
            </div>
          )}

        {this.renderFee()}
      </div>
    );
  }

  private renderFee() {
    const { gasPrice, scheduling, scheduleGasPrice, timeBounty } = this.props;
    const { feeSummary } = this.state.options;

    if (!feeSummary) {
      return;
    }

    if (scheduling) {
      return (
        <div className="AdvancedGas-fee-summary">
          <SchedulingFeeSummary
            gasPrice={gasPrice}
            scheduleGasPrice={scheduleGasPrice}
            render={({ gasPriceWei, scheduleGasLimit, fee, usd }) => (
              <div>
                <span>
                  <UnitDisplay
                    value={EAC_SCHEDULING_CONFIG.FEE.mul(EAC_SCHEDULING_CONFIG.FEE_MULTIPLIER)}
                    unit={'ether'}
                    displayShortBalance={true}
                    checkOffline={true}
                    symbol="ETH"
                  />{' '}
                  + {timeBounty && timeBounty.value && timeBounty.value.toString()} + {gasPriceWei}{' '}
                  * {EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT.toString()} +{' '}
                  {scheduleGasPrice && scheduleGasPrice.value && scheduleGasPrice.value.toString()}{' '}
                  * ({EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST.toString()} + {scheduleGasLimit})
                  = {fee} {usd && <span>~= ${usd} USD</span>}
                </span>
              </div>
            )}
          />
        </div>
      );
    }

    return (
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
    scheduleGasPrice: getScheduleGasPrice(state),
    timeBounty: getTimeBounty(state),
    validGasPrice: isValidGasPrice(state)
  }),
  { toggleAutoGasLimit }
)(AdvancedGas);
