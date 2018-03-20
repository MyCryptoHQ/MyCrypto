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
  SigningStatus,
  WindowStartField
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { NonStandardTransaction } from './components';
import { getCurrentWindowStart, ICurrentWindowStart } from 'selectors/transaction';
import { getNetworkConfig } from 'selectors/config';

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
  schedulingDisabled: boolean;
  shouldDisplay: boolean;
  offline: boolean;
  windowStart: ICurrentWindowStart;
}

class FieldsClass extends Component<StateProps> {
  public render() {
    const { schedulingDisabled, shouldDisplay, windowStart } = this.props;

    const scheduling = Boolean(windowStart.value);

    const content = (
      <div className="Tab-content-pane">
        <AddressField />
        <div className="row form-group">
          <div className="col-xs-12">
            <AmountField hasUnitDropdown={true} />
            <SendEverything />
          </div>
        </div>

        {!schedulingDisabled && (
          <div className="row form-group">
            <div className="col-xs-12">
              <WindowStartField />
            </div>
          </div>
        )}

        <div className="row form-group">
          <div className="col-xs-12">
            <TXMetaDataPanel scheduling={scheduling} />
          </div>
        </div>

        <CurrentCustomMessage />
        <NonStandardTransaction />

        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            <GenerateTransaction scheduling={scheduling} />
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
  offline: getOffline(state),
  windowStart: getCurrentWindowStart(state),
  schedulingDisabled: getNetworkConfig(state).name !== 'Kovan'
}))(FieldsClass);
