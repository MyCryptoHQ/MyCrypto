import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { SetIntersection } from 'utility-types';

import Icon from './Icon';

type ToolTipIcon = SetIntersection<
  React.ComponentProps<typeof Icon>['type'],
  'questionBlack' | 'questionWhite' | 'informational' | 'warning'
>;

const Override = styled.div<SpaceProps>`
  /* Allow caller to control spacing  */
  ${space}
  /* Make itself neutral */
  display: inline-flex;
  /* Allow UITooltip enclosing span to behave corectly*/
  span {
    display: inline-flex;
  }
`;

function Tooltip({
  type = 'questionBlack',
  tooltip,
  children,
  marginLeft = '1ch', // Provide default value that can be overridden.
  ...props
}: {
  tooltip: React.ReactNode;
  type?: ToolTipIcon;
  children?: React.ReactNode;
} & SpaceProps) {
  return (
    <Override marginLeft={marginLeft} {...props}>
      <UITooltip tooltip={tooltip}>{children ? children : <Icon type={type} />}</UITooltip>
    </Override>
  );
}

export default Tooltip;
