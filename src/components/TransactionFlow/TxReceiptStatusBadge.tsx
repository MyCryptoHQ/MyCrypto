import React from 'react';

import { Box, Icon } from '@components';
import { ITxStatus } from '@types';

export const TxReceiptStatusBadge = ({ status }: { status: ITxStatus }) => {
  const icon = (() => {
    switch (status) {
      case ITxStatus.SUCCESS:
        return 'status-badge-success';

      case ITxStatus.FAILED:
        return 'status-badge-declined';

      default:
        return 'status-badge-pending';
    }
  })();
  return (
    <Box as="span" display="flex" data-testid={status}>
      <Icon width="90" height="20" type={icon} />
    </Box>
  );
};
