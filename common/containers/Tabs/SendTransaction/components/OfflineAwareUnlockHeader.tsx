import { UnlockHeader } from 'components/ui';
import React from 'react';
import translate from 'translations';
import { Offline } from 'components/renderCbs';

export const OfflineAwareUnlockHeader: React.SFC<{}> = () => (
  <UnlockHeader title={title} allowReadOnly={true} />
);

const title = (
  <div>
    {translate('Account')}
    <Offline
      withOffline={({ forceOffline, offline }) => (offline || forceOffline ? offlineTitle : null)}
    />
  </div>
);

const offlineTitle = <span style={{ color: 'red' }}> (Offline)</span>;
