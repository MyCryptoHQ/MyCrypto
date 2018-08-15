import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  AddressField,
  AmountField,
  PaymentIdField,
  GenerateTransaction,
  SendButton,
  GenerateScheduleTransactionButton,
  SendScheduleTransactionButton
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'features/reducers';
import { getOffline, getNetworkConfig } from 'features/config';
import { scheduleSelectors } from 'features/schedule';
import { getUnit, isAnyOfflineWithWeb3 } from 'features/selectors';
import { PrivacyRadio } from 'components/PrivacyRadio';
import { PriorityRadio } from 'components/PriorityRadio';

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
  networkId: string;
  useScheduling: scheduleSelectors.ICurrentSchedulingToggle['value'];
}

class XmrFieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay, networkId } = this.props;

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <div className="Tab-content-pane">
                <AddressField showLabelMatch={true} placeholder="Enter a Monero Address" />
                <AmountField
                  networkId={networkId}
                  hasUnitDropdown={false}
                  hasSendEverything={true}
                />
                <PaymentIdField optional={true} />
                <PrivacyRadio />
                <PriorityRadio />
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
        return (
          <div className="submit-form">
            <GenerateScheduleTransactionButton />;
          </div>
        );
      }

      return (
        <div className="submit-form">
          <SendScheduleTransactionButton signing={true} />;
        </div>
      );
    }

    if (offline) {
      return (
        <div className="submit-form">
          <GenerateTransaction />;
        </div>
      );
    }

    return (
      <div className="submit-form">
        <SendButton signing={true} />
      </div>
    );
  }
}

export const XMRFields = connect((state: AppState) => ({
  schedulingAvailable: getNetworkConfig(state).name === 'Kovan' && getUnit(state) === 'ETH',
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state),
  useScheduling: scheduleSelectors.getCurrentSchedulingToggle(state).value,
  networkId: getNetworkConfig(state).id
}))(XmrFieldsClass);
