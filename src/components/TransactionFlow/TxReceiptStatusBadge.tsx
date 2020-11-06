import React from 'react';

import { Icon } from '@components';
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
  return <Icon type={icon} />;
};
