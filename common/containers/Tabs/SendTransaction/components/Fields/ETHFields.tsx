import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { getOffline, getNetworkConfig } from 'features/config';
import { scheduleSelectors } from 'features/schedule';
import { notificationsActions } from 'features/notifications';
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
  networkId: string;
}

interface DispatchProps {
  showNotification: notificationsActions.TShowNotification;
}

class FieldsClass extends Component<StateProps & DispatchProps> {
  public componentDidCatch(error: Error) {
    if (error.message === 'Serialized transaction not found') {
      /**
       * @desc Occasionally, when a new signed transaction matches a previous transaction,
       * the nonce does not update, since the transaction has not yet been confirmed. This triggers
       * the <Amounts /> component inside the <ConfirmationModal /> of <TXMetaDataPanel /> to throw
       * an error when selecting the current transaction's serialized parameters.
       * A longer term fix will involve finding a better way to calculate nonces to avoid
       * nonce duplication on serial transactions.
       */
      this.props.showNotification('danger', translateRaw('SIMILAR_TRANSACTION_ERROR'));
      this.forceUpdate();
    }
  }

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

export const ETHFields = connect(
  (state: AppState) => ({
    schedulingAvailable:
      getNetworkConfig(state).name === 'Kovan' && selectors.getUnit(state) === 'ETH',
    shouldDisplay: !selectors.isAnyOfflineWithWeb3(state),
    offline: getOffline(state),
    networkId: getNetworkConfig(state).id,
    useScheduling: scheduleSelectors.getCurrentSchedulingToggle(state).value
  }),
  {
    showNotification: notificationsActions.showNotification
  }
)(FieldsClass);
