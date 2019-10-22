import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { NewTabLink } from 'components/ui';

interface StateProps {
  offline: AppState['config']['meta']['offline'];
}
class OfflineBroadcastClass extends Component<StateProps> {
  public render() {
    return this.props.offline ? <BroadCast /> : null;
  }
}

export const OfflineBroadcast = connect((state: AppState) => ({
  offline: configMetaSelectors.getOffline(state)
}))(OfflineBroadcastClass);
const BroadCast: React.SFC<{}> = () => (
  <p>
    To broadcast this transaction, paste the above into the{' '}
    <Link to="/pushTx">Broadcast Transaction tab</Link> or{' '}
    <NewTabLink href="https://etherscan.io/pushTx">etherscan.io/pushTx</NewTabLink>
  </p>
);
