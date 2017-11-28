import React from 'react';
import { Offline } from 'components/renderCbs';

export const OfflineBroadcast: React.SFC<{}> = () => (
  <Offline withOffline={({ offline }) => (offline ? <BroadCast /> : null)} />
);

const BroadCast: React.SFC<{}> = () => (
  <p>
    To broadcast this transaction, paste the above into{' '}
    <a href="https://myetherwallet.com/pushTx"> myetherwallet.com/pushTx</a> or{' '}
    <a href="https://etherscan.io/pushTx"> etherscan.io/pushTx</a>
  </p>
);
