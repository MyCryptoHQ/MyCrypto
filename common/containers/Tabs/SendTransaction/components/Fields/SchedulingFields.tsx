import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import {
  AddressField,
  AmountField,
  TXMetaDataPanel,
  SendEverything,
  CurrentCustomMessage,
  GenerateTransaction,
  SendButton,
  SigningStatus,
  WindowStartField
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';
import { NewTabLink } from 'components/ui';

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
}

class SchedulingFieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay } = this.props;

    const content = (
      <div className="Tab-content-pane">
        <div className="row form-group">
          <div className="col-xs-12">
            <h3>ChronoLogic Scheduler</h3>
            Powered by the <EACLink />, ChronoLogic Scheduler is a decentralized scheduling protocol
            based on the Ethereum blockchain.
          </div>
        </div>
        <div className="row form-group" />

        <AddressField />
        <div className="row form-group">
          <div className="col-xs-12">
            <AmountField hasUnitDropdown={true} />
            <SendEverything />
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
            <GenerateTransaction scheduling={true} />
          </div>
        </div>
        <SigningStatus />
        <div className="row form-group">
          <SendButton />
        </div>
      </div>
    );

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay ? content : null}
          </React.Fragment>
        }
      />
    );
  }
}

export const SchedulingFields = connect((state: AppState) => ({
  shouldDisplay: !isAnyOfflineWithWeb3(state)
}))(SchedulingFieldsClass);
