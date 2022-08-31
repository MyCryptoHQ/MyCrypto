import { DisplayProps } from 'styled-system';

import { Box, Icon } from '@components';
import { ITxStatus } from '@types';

export const TxReceiptStatusBadge = ({ status, display }: { status: ITxStatus } & DisplayProps) => {
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
    <Box as="span" display={display} data-testid={status}>
      <Icon width="90px" height="20px" type={icon} />
    </Box>
  );
};
