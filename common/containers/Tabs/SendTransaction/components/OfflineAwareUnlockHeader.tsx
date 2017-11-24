import { UnlockHeader } from 'components/ui';
import React from 'react';
import translate from 'translations';
import { Offline } from 'components/renderCbs';

export const OfflineAwareUnlockHeader: React.SFC<{}> = () => (
  <UnlockHeader title={title} />
);

const title = (
  <div>
    {translate('NAV_SendEther')}
    <Offline
      withOffline={({ forceOffline, offline }) =>
        offline || forceOffline ? offlineTitle : null
      }
    />
  </div>
);

const offlineTitle = <span style={{ color: 'red' }}> (Offline)</span>;
