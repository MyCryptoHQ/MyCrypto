import React from 'react';

import { Box } from '@components';

import ActionTile from './ActionTile';

export const DashboardGas = () => (
  <Box variant="rowAlign" justifyContent="space-between">
    <Box width="48%">
      <ActionTile link="#" title="154.234 gwei" description="Current Base Fee" />
    </Box>
    <Box width="48%">
      <ActionTile link="#" title="154.234 gwei" description="Current Base Fee" />
    </Box>
  </Box>
);
