import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import {
  NonceField,
  AddressField,
  AmountField,
  DataField,
  GasField,
  SendEverything,
  CurrentCustomMessage,
  GenerateTransaction,
  SendButton,
  SigningStatus
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';
import { Aux } from 'components/ui';
import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';

const content = (
  <div className="Tab-content-pane">
    <AddressField />
    <div className="row form-group">
      <div className="col-xs-11">
        <AmountField hasUnitDropdown={true} />
        <SendEverything />
      </div>
      <div className="col-xs-1" />
    </div>

    <div className="row form-group">
      <div className="col-xs-11">
        <GasField />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-xs-11">
        <NonceField />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-xs-11">
        <DataField />
      </div>
    </div>
    <CurrentCustomMessage />
    <NonStandardTransaction />
    <div className="row form-group">
      <div className="col-xs-12 clearfix">
        <GenerateTransaction />
      </div>
    </div>
    <SigningStatus />
    <div className="row form-group">
      <SendButton />
    </div>
  </div>
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

class FieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay } = this.props;
    return (
      <OnlyUnlocked
        whenUnlocked={
          <Aux>
            <QueryWarning />
            {shouldDisplay ? content : null}
          </Aux>
        }
      />
    );
  }
}

export const Fields = connect((state: AppState) => ({
  shouldDisplay: !isAnyOfflineWithWeb3(state)
}))(FieldsClass);
