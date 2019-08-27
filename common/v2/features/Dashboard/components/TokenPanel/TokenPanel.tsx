import React from 'react';

import { DashboardPanel } from 'v2/components';
import { TokenList } from './TokenList';

export function TokenPanel() {
  return (
    <DashboardPanel
      heading="Tokens"
      headingRight="+ Add Tokens"
      actionLink="/dashboard/add-tokens"
      padChildren={true}
    >
      <TokenList />
    </DashboardPanel>
  );
}
