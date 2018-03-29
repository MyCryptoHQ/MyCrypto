import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import {
  AddressField,
  AmountField,
  TXMetaDataPanel,
  CurrentCustomMessage,
  GenerateTransaction,
  SendButton,
  WindowStartField,
  ScheduleTimestampField,
  ScheduleTimezoneDropDown,
  TimeBountyField,
  ScheduleType,
  WindowSizeField,
  SchedulingToggle,
  ScheduleGasPriceField
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';
import { getOffline } from 'selectors/config';
import { SendScheduleTransactionButton } from 'containers/Tabs/ScheduleTransaction/components/SendScheduleTransactionButton';
import { GenerateScheduleTransactionButton } from 'containers/Tabs/ScheduleTransaction/components/GenerateScheduleTransactionButton';
import {
  getCurrentScheduleType,
  ICurrentScheduleType,
  getCurrentSchedulingToggle,
  ICurrentSchedulingToggle
} from 'selectors/transaction';

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_SEND_LINK')}</p>
      </div>
    }
  />
);

interface StateProps {
  scheduling: boolean;
  shouldDisplay: boolean;
  offline: boolean;
  schedulingType: ICurrentScheduleType;
  useScheduling: ICurrentSchedulingToggle['value'];
}

class FieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay, scheduling, useScheduling, schedulingType } = this.props;

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <div className="Tab-content-pane">
                <AddressField />
                <div className="row form-group">
                  <div className="col-xs-10">
                    <AmountField hasUnitDropdown={true} hasSendEverything={true} />
                  </div>
                  {scheduling && (
                    <div className="col-xs-2">
                      <SchedulingToggle />
                    </div>
                  )}
                </div>

                {useScheduling && (
                  <div className="scheduled-tx-settings">
                    <h6>Scheduled Transaction Settings</h6>
                    <br />

                    <div className="row form-group">
                      <div className="col-xs-3">
                        <ScheduleType />
                      </div>

                      {schedulingType.value === 'time' && (
                        <div>
                          <div className="col-xs-12 col-md-3">
                            <ScheduleTimestampField />
                          </div>
                          <div className="col-xs-12 col-md-3">
                            <ScheduleTimezoneDropDown />
                          </div>
                        </div>
                      )}

                      {schedulingType.value === 'block' && (
                        <div>
                          <div className="col-xs-12 col-md-6">
                            <WindowStartField />
                          </div>
                        </div>
                      )}

                      <div className="col-xs-12 col-md-3">
                        <WindowSizeField />
                      </div>
                    </div>

                    <div className="row form-group">
                      <div className="col-xs-6">
                        <ScheduleGasPriceField />
                      </div>
                      <div className="col-xs-6">
                        <TimeBountyField />
                      </div>
                    </div>
                  </div>
                )}

                <div className="row form-group">
                  <div className="col-xs-12">
                    <TXMetaDataPanel scheduling={useScheduling} />
                  </div>
                </div>

                <CurrentCustomMessage />
                <NonStandardTransaction />

                {this.getTxButton()}
              </div>
            )}
          </React.Fragment>
        }
      />
    );
  }

  private getTxButton() {
    const { offline, useScheduling } = this.props;

    if (useScheduling) {
      if (offline) {
        return <GenerateScheduleTransactionButton />;
      }

      return <SendScheduleTransactionButton signing={true} />;
    }

    if (offline) {
      return <GenerateTransaction />;
    }

    return <SendButton signing={true} />;
  }
}

export const Fields = connect((state: AppState) => ({
  scheduling: true,
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state),
  schedulingType: getCurrentScheduleType(state),
  useScheduling: getCurrentSchedulingToggle(state).value
}))(FieldsClass);
