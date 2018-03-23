import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import {
  AddressField,
  AmountField,
  TXMetaDataPanel,
  CurrentCustomMessage,
  GenerateTransaction,
  SendButton
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';
import { getOffline } from 'selectors/config';

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
  shouldDisplay: boolean;
  offline: boolean;
}

class FieldsClass extends Component<StateProps> {
  public render() {
    const { shouldDisplay, offline } = this.props;
    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <div className="Tab-content-pane">
                <AddressField />
                <div className="row form-group">
                  <div className="col-xs-12">
                    <AmountField hasUnitDropdown={true} hasSendEverything={true} />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-xs-12">
                    <TXMetaDataPanel />
                  </div>
                </div>

                <CurrentCustomMessage />
                <NonStandardTransaction />

                {offline ? <GenerateTransaction /> : <SendButton signing={true} />}
              </div>
            )}
          </React.Fragment>
        }
      />
    );
  }
}

export const Fields = connect((state: AppState) => ({
  shouldDisplay: !isAnyOfflineWithWeb3(state),
  offline: getOffline(state)
}))(FieldsClass);
