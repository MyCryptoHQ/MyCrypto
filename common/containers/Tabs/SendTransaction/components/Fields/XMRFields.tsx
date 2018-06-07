import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
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

import { AppState } from 'reducers';
import { getOffline, getNetworkConfig } from 'selectors/config';
import { getCurrentSchedulingToggle, ICurrentSchedulingToggle } from 'selectors/schedule/fields';
import { getUnit } from 'selectors/transaction';
import { PrivacyRadio } from 'components/PrivacyRadio';

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
  useScheduling: ICurrentSchedulingToggle['value'];
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
                <PaymentIdField />
                <AmountField
                  networkId={networkId}
                  hasUnitDropdown={false}
                  hasSendEverything={true}
                />
                <PrivacyRadio />
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

export const XmrFields = connect((state: AppState) => ({
  schedulingAvailable: getNetworkConfig(state).name === 'Kovan' && getUnit(state) === 'ETH',
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state),
  useScheduling: getCurrentSchedulingToggle(state).value,
  networkId: getNetworkConfig(state).id
}))(XmrFieldsClass);
