import { Query } from 'components/renderCbs';
import React, { Component } from 'react';
import { TokenValue, Wei } from 'libs/units';
import translate from 'translations';
import { connect } from 'react-redux';
import { sendEverythingRequested, TSendEverythingRequested } from 'actions/transaction';
import { getCurrentBalance } from 'selectors/wallet';
import { AppState } from 'reducers';

interface DispatchProps {
  sendEverythingRequested: TSendEverythingRequested;
}
interface StateProps {
  currentBalance: Wei | TokenValue | null;
}
type Props = StateProps & DispatchProps;

class SendEverythingClass extends Component<Props> {
  public render() {
    if (!this.props.currentBalance) {
      return null;
    }
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          !readOnly ? (
            <span className="help-block">
              <a onClick={this.onSendEverything}>
                <span className="strong">{translate('SEND_TransferTotal')}</span>
              </a>
            </span>
          ) : null
        }
      />
    );
  }
  private onSendEverything = () => {
    this.props.sendEverythingRequested();
  };
}
export const SendEverything = connect(
  (state: AppState) => ({ currentBalance: getCurrentBalance(state) }),
  { sendEverythingRequested }
)(SendEverythingClass);
