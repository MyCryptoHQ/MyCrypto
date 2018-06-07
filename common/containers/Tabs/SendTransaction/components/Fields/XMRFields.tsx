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
  useScheduling: ICurrentSchedulingToggle['value'];
}

class XmrFieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay } = this.props;

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
                  hasUnitDropdown={false}
                  hasSendEverything={true}
                  // showBlockies={false}
                />
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

export const XmrFields = connect((state: AppState) => ({
  schedulingAvailable: getNetworkConfig(state).name === 'Kovan' && getUnit(state) === 'ETH',
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state),
  useScheduling: getCurrentSchedulingToggle(state).value
}))(XmrFieldsClass);
