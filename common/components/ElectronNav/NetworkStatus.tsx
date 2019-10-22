import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import {
  configMetaSelectors,
  configSelectors,
  configNodesSelectedSelectors
} from 'features/config';
import './NetworkStatus.scss';

enum NETWORK_STATUS {
  CONNECTING = 'NETWORK_STATUS_CONNECTING',
  OFFLINE = 'NETWORK_STATUS_OFFLINE',
  ONLINE = 'NETWORK_STATUS_ONLINE'
}

interface StateProps {
  network: NetworkConfig;
  isOffline: boolean;
  isChangingNode: boolean;
}

const NetworkStatus: React.SFC<StateProps> = ({ isOffline, isChangingNode, network }) => {
  let statusClass: string;
  let statusText: string;
  const $network = network.isCustom ? network.unit : network.name;

  if (isChangingNode) {
    statusClass = 'is-connecting';
    statusText = NETWORK_STATUS.CONNECTING;
  } else if (isOffline) {
    statusClass = 'is-offline';
    statusText = NETWORK_STATUS.OFFLINE;
  } else {
    statusClass = 'is-online';
    statusText = NETWORK_STATUS.ONLINE;
  }

  return (
    <div className="NetworkStatus">
      <div className={`NetworkStatus-icon ${statusClass}`} />
      <div className="NetworkStatus-text">{translate(statusText, { $network })}</div>
    </div>
  );
};

export default connect(
  (state: AppState): StateProps => ({
    network: configSelectors.getNetworkConfig(state),
    isOffline: configMetaSelectors.getOffline(state),
    isChangingNode: configNodesSelectedSelectors.isNodeChanging(state)
  })
)(NetworkStatus);
