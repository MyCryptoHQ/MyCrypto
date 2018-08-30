import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { Tooltip, UnitDisplay, Input } from 'components/ui';
import Help from 'components/ui/Help';
import { AppState } from 'features/reducers';
import { NetworkConfig } from 'shared/types/network';
import { getOffline } from 'features/config/meta/selectors';
import { getNetworkConfig } from 'features/config/selectors';
import { connect } from 'react-redux';
import { ICurrentTimeBounty } from 'features/schedule/selectors';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import GroupedRadioToggle from 'components/ui/GroupedRadioToggle';
import BN from 'bn.js';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

import './TimeBountyField.scss';

interface DispatchProps {
  setTimeBounty: scheduleActions.TSetCurrentTimeBounty;
}

interface StateProps {
  currentTimeBounty: scheduleSelectors.ICurrentTimeBounty;
  isOffline: AppState['config']['meta']['offline'];
  isValid: boolean;
  network: NetworkConfig;
  rates: AppState['rates']['rates'];
}

interface OwnProps {
  isReadOnly?: boolean;
}

type Props = OwnProps & DispatchProps & StateProps;

interface State {
  advanced: boolean;
}

class TimeBountyFieldClass extends Component<Props, State> {
  public state = {
    advanced: false
  };

  public render() {
    const { currentTimeBounty, isReadOnly, isValid } = this.props;
    const { advanced } = this.state;

    return (
      <>
        <div className="input-group-wrapper">
          <label className="input-group">
            <div className="input-group-header">
              <span className="ScheduleFields-field-title">
                <div className="ScheduleFields-field-title-text">
                  {translate('SCHEDULE_TIMEBOUNTY')}
                </div>
                <div className="ScheduleFields-field-title-tooltip">
                  <Tooltip>{translateRaw('SCHEDULE_TIMEBOUNTY_TOOLTIP')}</Tooltip>
                  <Help className="ScheduleFields-field-title-help" />
                </div>
              </span>
            </div>
            <div className="TimeBountyField">
              <div className="TimeBountyField-wrapper">
                {advanced ? (
                  <Input
                    isValid={isValid}
                    className="TimeBountyField-input"
                    type="text"
                    value={currentTimeBounty.raw}
                    placeholder={translateRaw('X_CUSTOM')}
                    readOnly={isReadOnly}
                    spellCheck={false}
                    onChange={this.handleOnChange}
                    showInvalidWithoutValue={true}
                  />
                ) : (
                  <GroupedRadioToggle
                    options={EAC_SCHEDULING_CONFIG.PRESET_TIME_BOUNTIES}
                    isValid={isValid}
                    onChangeHandler={this.handleOnChange}
                    selectedValue={currentTimeBounty.raw}
                  />
                )}

                <div className="TimeBountyField-preview">
                  <span className="TimeBountyField-preview-display">
                    ${this.getUSDEstimation(currentTimeBounty)}
                  </span>
                </div>
              </div>
            </div>
          </label>
        </div>
        <a
          href="#"
          onClick={() => this.setState({ advanced: !advanced })}
          className="TimeBountyField-advanced-toggle"
        >
          {advanced ? `- ${translateRaw('TRANS_SIMPLE')}` : `+ ${translateRaw('TRANS_ADVANCED')}`}
        </a>
      </>
    );
  }

  private getUSDEstimation(currentTimeBounty: ICurrentTimeBounty) {
    const { isOffline, network, rates } = this.props;

    const usdBig = network.isTestnet
      ? new BN(0)
      : currentTimeBounty.value &&
        rates[network.unit] &&
        currentTimeBounty.value.muln(rates[network.unit].USD);

    const usd = isOffline ? null : (
      <UnitDisplay
        value={usdBig}
        unit="ether"
        displayShortBalance={2}
        displayTrailingZeroes={true}
        checkOffline={true}
      />
    );

    return usd;
  }

  private handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setTimeBounty(value);
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    currentTimeBounty: scheduleSelectors.getCurrentTimeBounty(state),
    isOffline: getOffline(state),
    isValid: scheduleSelectors.isValidCurrentTimeBounty(state),
    network: getNetworkConfig(state),
    rates: state.rates.rates
  };
}

export const TimeBountyField = connect(mapStateToProps, {
  setTimeBounty: scheduleActions.setCurrentTimeBounty
})(TimeBountyFieldClass);
