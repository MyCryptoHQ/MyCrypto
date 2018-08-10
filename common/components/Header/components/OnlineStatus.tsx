import React from 'react';

import { Tooltip } from 'components/ui';
import './OnlineStatus.scss';

interface Props {
  isOffline: boolean;
}

const OnlineStatus: React.SFC<Props> = ({ isOffline }) => (
  <div className={`OnlineStatus ${isOffline ? 'is-offline' : 'is-online'}`}>
    <Tooltip direction="left">{isOffline ? 'Offline' : 'Online'}</Tooltip>
  </div>
);

export default OnlineStatus;
