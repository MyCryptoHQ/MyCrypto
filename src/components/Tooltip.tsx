import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';
import { SetIntersection } from 'utility-types';

import { Icon } from '@components';

type ToolTipIcon = SetIntersection<
  React.ComponentProps<typeof Icon>['type'],
  'questionBlack' | 'questionWhite' | 'informational' | 'warning'
>;

function Tooltip({
  type = 'questionBlack',
  tooltip,
  children
}: {
  tooltip: React.ReactNode;
  type?: ToolTipIcon;
  children?: React.ReactNode;
}) {
  return <UITooltip tooltip={tooltip}>{children ? children : <Icon type={type} />}</UITooltip>;
}

export default Tooltip;
