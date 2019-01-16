import React from 'react';
import chunk from 'lodash/chunk';

import { Layout } from 'v2/components';
import { ActionTile, WalletBreakdown } from './components';
import { actions } from './constants';
import './Dashboard.scss';

export default function Dashboard() {
  const [topRow, bottomRow] = chunk(actions, 3);
  return (
    <Layout className="Dashboard" fluid={true}>
      <div className="Dashboard-actions">
        <div>
          <div className="Dashboard-actions-row">
            {topRow.map(action => <ActionTile key={action.title} {...action} />)}
          </div>
          <div className="Dashboard-actions-row">
            {bottomRow.map(action => <ActionTile key={action.title} {...action} />)}
          </div>
        </div>
      </div>
      <div className="Dashboard-divider" />
      <div className="Dashboard-walletBreakdown">
        <WalletBreakdown />
      </div>
    </Layout>
  );
}
