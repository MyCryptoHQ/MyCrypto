import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { getOffline, getNetworkConfig } from 'features/config';
import { scheduleSelectors } from 'features/schedule';
import {
  AddressField,
  AmountField,
  TXMetaDataPanel,
  CurrentCustomMessage,
  GenerateTransaction,
  SendButton,
  SchedulingToggle,
  ScheduleFields,
  GenerateScheduleTransactionButton,
  SendScheduleTransactionButton
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import { NonStandardTransaction } from './components';

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
  schedulingAvailable: boolean;
  shouldDisplay: boolean;
  offline: boolean;
  useScheduling: scheduleSelectors.ICurrentSchedulingToggle['value'];
}

class FieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay, schedulingAvailable, useScheduling } = this.props;

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <div className="Tab-content-pane">
                <AddressField showLabelMatch={true} />
                <div className="row form-group">
                  <div
                    className={schedulingAvailable ? 'col-sm-9 col-md-10' : 'col-sm-12 col-md-12'}
                  >
                    <AmountField
                      hasUnitDropdown={true}
                      hasSendEverything={true}
                      showInvalidWithoutValue={true}
                    />
                  </div>
                  {schedulingAvailable && (
                    <div className="col-sm-3 col-md-2">
                      <SchedulingToggle />
                    </div>
                  )}
                </div>

                {useScheduling && <ScheduleFields />}

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
  schedulingAvailable:
    getNetworkConfig(state).name === 'Kovan' && selectors.getUnit(state) === 'ETH',
  shouldDisplay: !selectors.isAnyOfflineWithWeb3(state),
  offline: getOffline(state),
  useScheduling: scheduleSelectors.getCurrentSchedulingToggle(state).value
}))(FieldsClass);
