import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { configSelectors, configMetaSelectors } from 'features/config';
import { scheduleSelectors } from 'features/schedule';
import { notificationsActions } from 'features/notifications';
import { networkSupportsScheduling } from 'libs/scheduling';
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
  SendScheduleTransactionButton,
  SchedulingModals
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
  useScheduling: boolean;
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
    const { shouldDisplay, schedulingAvailable, useScheduling, offline } = this.props;

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
                      showAllTokens={offline}
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

                <SchedulingModals />
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

export const Fields = connect(
  (state: AppState) => ({
    schedulingAvailable: networkSupportsScheduling(configSelectors.getNetworkConfig(state).name),
    shouldDisplay: !selectors.isAnyOfflineWithWeb3(state),
    offline: configMetaSelectors.getOffline(state),
    useScheduling: scheduleSelectors.getSchedulingToggle(state).value
  }),
  {
    showNotification: notificationsActions.showNotification
  }
)(FieldsClass);
