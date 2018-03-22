import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import {
  AddressField,
  AmountField,
  TXMetaDataPanel,
  CurrentCustomMessage,
  WindowStartField
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';
import { NewTabLink } from 'components/ui';
import { getOffline } from 'selectors/config';
import { SendScheduleTransactionButton } from 'containers/Tabs/ScheduleTransaction/components/SendScheduleTransactionButton';
import { GenerateScheduleTransactionButton } from 'containers/Tabs/ScheduleTransaction/components/GenerateScheduleTransactionButton';

const EACLink = () => (
  <NewTabLink href="https://chronologic.network" content="Ethereum Alarm Clock" />
);

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_Send_Link')}</p>
      </div>
    }
  />
);

interface StateProps {
  shouldDisplay: boolean;
  offline: boolean;
}

class SchedulingFieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay, offline } = this.props;

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <div className="Tab-content-pane">
                <div className="row form-group">
                  <div className="col-xs-12">
                    <h3>ChronoLogic Scheduler</h3>
                    Powered by the <EACLink />, ChronoLogic Scheduler is a decentralized scheduling
                    protocol based on the Ethereum blockchain.
                  </div>
                </div>
                <div className="row form-group" />

                <AddressField />
                <div className="row form-group">
                  <div className="col-xs-12">
                    <AmountField hasUnitDropdown={true} hasSendEverything={true} />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-xs-12">
                    <WindowStartField />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-xs-12">
                    <TXMetaDataPanel scheduling={true} />
                  </div>
                </div>

                <CurrentCustomMessage />
                <NonStandardTransaction />

                <div className="row form-group">
                  <div className="col-xs-12 clearfix">
                    {offline ? (
                      <GenerateScheduleTransactionButton />
                    ) : (
                      <SendScheduleTransactionButton signing={true} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        }
      />
    );
  }
}

export const SchedulingFields = connect((state: AppState) => ({
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state)
}))(SchedulingFieldsClass);
