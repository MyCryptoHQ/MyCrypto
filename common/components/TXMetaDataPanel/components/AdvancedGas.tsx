import React from 'react';
import { connect } from 'react-redux';

import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { configMetaActions, configMetaSelectors } from 'features/config';
import { scheduleSelectors } from 'features/schedule';
import { transactionFieldsActions, transactionSelectors } from 'features/transaction';
import {
  NonceField,
  GasLimitField,
  DataField,
  ScheduleDepositField,
  ScheduleType,
  WindowSizeField
} from 'components';
import { Input } from 'components/ui';
import FeeSummary, { RenderData } from './FeeSummary';
import './AdvancedGas.scss';

export interface AdvancedOptions {
  gasPriceField?: boolean;
  gasLimitField?: boolean;
  nonceField?: boolean;
  dataField?: boolean;
  feeSummary?: boolean;
}

interface OwnProps {
  inputGasPrice: transactionFieldsActions.TInputGasPrice;
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
  toggleAutoGasLimit: configMetaActions.TToggleAutoGasLimit;
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
        {scheduling && (
          <div>
            <div className="row vcenter-sm">
              <div className="col-xs-6 col-md-4 col-lg-3">
                <ScheduleType />
              </div>
              <div className="col-xs-6 col-md-8 col-lg-9">
                <WindowSizeField />
              </div>
            </div>

            <ScheduleDepositField />
          </div>
        )}

        <div className="AdvancedGas-calculate-limit">
          <label className="checkbox">
            <input
              type="checkbox"
              defaultChecked={autoGasLimitEnabled}
              onChange={this.handleToggleAutoGasLimit}
            />
            <span>{translate('TRANS_AUTO_GAS_TOGGLE')}</span>
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
                  {/*We leave type as string instead of number, because things such as multiple decimals
                  or invalid exponent notation does not fire the onchange handler
                  so the component will not display as invalid for such things */}
                  <Input
                    isValid={validGasPrice}
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
              <NonceField alwaysDisplay={true} showInvalidBeforeBlur={true} />
            </div>
          )}
        </div>

        {dataField && (
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

  private getScheduleFeeFormula({ gasLimit, gasPriceWei, scheduleGasLimit, fee, usd }: RenderData) {
    const { scheduleGasPrice, timeBounty } = this.props;

    return (
      <div>
        {timeBounty && timeBounty.value && timeBounty.value.toString()} + {gasPriceWei} *{' '}
        {gasLimit.toString()} +{' '}
        {scheduleGasPrice && scheduleGasPrice.value && scheduleGasPrice.value.toString()} * ({EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST.toString()}{' '}
        + {scheduleGasLimit}) =&nbsp;{fee}&nbsp;{usd && <span>~=&nbsp;${usd}&nbsp;USD</span>}
      </div>
    );
  }

  private handleGasPriceChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputGasPrice(value);
  };

  private handleToggleAutoGasLimit = (_: React.FormEvent<HTMLInputElement>) => {
    this.props.toggleAutoGasLimit();
  };
}

export default connect(
  (state: AppState) => ({
    autoGasLimitEnabled: configMetaSelectors.getAutoGasLimitEnabled(state),
    validGasPrice: transactionSelectors.isValidGasPrice(state),
    timeBounty: scheduleSelectors.getTimeBounty(state),
    scheduleGasPrice: scheduleSelectors.getScheduleGasPrice(state)
  }),
  { toggleAutoGasLimit: configMetaActions.toggleAutoGasLimit }
)(AdvancedGas);
