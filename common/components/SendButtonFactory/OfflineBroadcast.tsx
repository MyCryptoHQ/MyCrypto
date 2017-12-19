import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getOffline } from 'selectors/config';

interface StateProps {
  offline: AppState['config']['offline'];
}
class OfflineBroadcastClass extends Component<StateProps> {
  public render() {
    return this.props.offline ? <BroadCast /> : null;
  }
}

export const OfflineBroadcast = connect((state: AppState) => ({ offline: getOffline(state) }))(
  OfflineBroadcastClass
);
const BroadCast: React.SFC<{}> = () => (
  <p>
    To broadcast this transaction, paste the above into{' '}
    <a href="https://myetherwallet.com/pushTx"> myetherwallet.com/pushTx</a> or{' '}
    <a href="https://etherscan.io/pushTx"> etherscan.io/pushTx</a>
  </p>
);
