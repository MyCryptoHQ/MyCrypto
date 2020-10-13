import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';
import styled from 'styled-components';
import { space, SpaceProps, verticalAlign, VerticalAlignProps } from 'styled-system';
import { SetIntersection } from 'utility-types';

import Icon from './Icon';

type ToolTipIcon = SetIntersection<
  React.ComponentProps<typeof Icon>['type'],
  'questionBlack' | 'questionWhite' | 'informational' | 'warning'
>;

const Override = styled.div<SpaceProps & VerticalAlignProps>`
  /* Allow caller to control spacing  */
  ${space}
  ${verticalAlign}
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
  verticalAlign = 'middle',
  ...props
}: {
  tooltip: React.ReactNode;
  type?: ToolTipIcon;
  children?: React.ReactNode;
} & SpaceProps &
  VerticalAlignProps) {
  return (
    <Override verticalAlign={verticalAlign} {...props}>
      <UITooltip tooltip={tooltip}>{children ? children : <Icon type={type} />}</UITooltip>
    </Override>
  );
}

export default Tooltip;
