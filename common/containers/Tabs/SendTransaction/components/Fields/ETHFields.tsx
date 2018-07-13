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
  SchedulingToggle,
  ScheduleFields,
  GenerateScheduleTransactionButton,
  SendScheduleTransactionButton
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';
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
  networkId: string;
  useScheduling: ICurrentSchedulingToggle['value'];
}

class EthFieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay, schedulingAvailable, useScheduling, networkId } = this.props;

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <div className="Tab-content-pane">
                <AddressField showLabelMatch={true} />
                <div className="row ">
                  <div
                    className={schedulingAvailable ? 'col-sm-9 col-md-10' : 'col-sm-12 col-md-12'}
                  >
                    <AmountField
                      networkId={networkId}
                      hasUnitDropdown={true}
                      hasSendEverything={true}
                    />
                  </div>
                  {schedulingAvailable && (
                    <div className="col-sm-3 col-md-2">
                      <SchedulingToggle />
                    </div>
                  )}
                </div>

                {useScheduling && <ScheduleFields />}

                <div className="row">
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

export const EthFields = connect((state: AppState) => ({
  schedulingAvailable: getNetworkConfig(state).name === 'Kovan' && getUnit(state) === 'ETH',
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state),
  useScheduling: getCurrentSchedulingToggle(state).value,
  networkId: getNetworkConfig(state).id
}))(EthFieldsClass);
