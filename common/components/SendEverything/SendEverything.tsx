import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { TokenValue, Wei } from 'libs/units';
import { AppState } from 'features/reducers';
import { sendEverythingRequested, TSendEverythingRequested } from 'features/transaction/actions';
import * as selectors from 'features/selectors';
import { Query } from 'components/renderCbs';
import { Tooltip } from 'components/ui';
import './SendEverything.scss';

interface DispatchProps {
  sendEverythingRequested: TSendEverythingRequested;
}
interface StateProps {
  currentBalance: Wei | TokenValue | null;
}
type Props = StateProps & DispatchProps;

class SendEverythingClass extends Component<Props> {
  public render() {
    const { currentBalance } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => (
          <button
            className="SendEverything"
            disabled={!!readOnly || !currentBalance}
            onClick={this.onSendEverything}
            aria-label={translateRaw('SEND_TRANSFERTOTAL')}
          >
            <i className="SendEverything-icon fa fa-angle-double-up" />
            <Tooltip>{translate('SEND_TRANSFERTOTAL')}</Tooltip>
          </button>
        )}
      />
    );
  }
  private onSendEverything = () => {
    this.props.sendEverythingRequested();
  };
}
export const SendEverything = connect(
  (state: AppState) => ({ currentBalance: selectors.getCurrentBalance(state) }),
  { sendEverythingRequested }
)(SendEverythingClass);
