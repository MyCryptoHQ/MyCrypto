import React from 'react';
import { translateRaw } from 'translations';
import FeeSummary, { RenderData } from './FeeSummary';
import './AdvancedGas.scss';
import { TToggleAutoGasLimit, toggleAutoGasLimit } from 'actions/config';
import { AppState } from 'reducers';
import { TInputGasPrice } from 'actions/transaction';
import { NonceField, GasLimitField, DataField } from 'components';
import { connect } from 'react-redux';
import { getAutoGasLimitEnabled } from 'selectors/config';
import { isValidGasPrice } from 'selectors/transaction';
import { sanitizeNumericalInput } from 'libs/values';
import { Input } from 'components/ui';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { getScheduleGasPrice, getTimeBounty } from 'selectors/schedule';

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
  scheduleGasPrice: AppState['schedule']['scheduleGasPrice'];
  timeBounty: AppState['schedule']['timeBounty'];
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
                hideGasCalculationSpinner={scheduling}
              />
            </div>
          )}
          {nonceField && (
            <div className="AdvancedGas-nonce">
              <NonceField alwaysDisplay={true} />
            </div>
          )}
        </div>

        {!scheduling &&
          dataField && (
            <div className="AdvancedGas-data">
              <DataField />
            </div>
          )}

        {this.renderFee()}
      </div>
    );
  }

  private renderFee() {
    const { gasPrice, scheduleGasPrice } = this.props;
    const { feeSummary } = this.state.options;

    if (!feeSummary) {
      return;
    }

    return (
      <div className="AdvancedGas-fee-summary">
        <FeeSummary
          gasPrice={gasPrice}
          scheduleGasPrice={scheduleGasPrice}
          render={(data: RenderData) => this.printFeeFormula(data)}
        />
      </div>
    );
  }

  private printFeeFormula(data: RenderData) {
    if (this.props.scheduling) {
      return this.getScheduleFeeFormula(data);
    }

    return this.getStandardFeeFormula(data);
  }

  private getStandardFeeFormula({ gasPriceWei, gasLimit, fee, usd }: RenderData) {
    return (
      <span>
        {gasPriceWei} * {gasLimit} = {fee} {usd && <span>~= ${usd} USD</span>}
      </span>
    );
  }

  private getScheduleFeeFormula({ gasPriceWei, scheduleGasLimit, fee, usd }: RenderData) {
    const { scheduleGasPrice, timeBounty } = this.props;

    return (
      <div>
        {timeBounty && timeBounty.value && timeBounty.value.toString()} + {gasPriceWei} *{' '}
        {EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT.toString()} +{' '}
        {scheduleGasPrice && scheduleGasPrice.value && scheduleGasPrice.value.toString()} * ({EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST.toString()}{' '}
        + {scheduleGasLimit}) =&nbsp;{fee}&nbsp;{usd && <span>~=&nbsp;${usd}&nbsp;USD</span>}
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
