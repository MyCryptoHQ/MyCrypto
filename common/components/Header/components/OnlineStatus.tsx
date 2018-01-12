import React from 'react';
import { Tooltip } from 'components/ui';
import './OnlineStatus.scss';

interface Props {
  isOffline: boolean;
}

const OnlineStatus: React.SFC<Props> = ({ isOffline }) => (
  <div className={`OnlineStatus fa-stack ${isOffline ? 'is-offline' : 'is-online'}`}>
    <Tooltip>{isOffline ? 'Offline' : 'Online'}</Tooltip>
  </div>
);

export default OnlineStatus;
