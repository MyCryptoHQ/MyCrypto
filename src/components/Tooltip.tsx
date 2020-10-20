import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';
import styled from 'styled-components';
import {
  display,
  DisplayProps,
  space,
  SpaceProps,
  verticalAlign,
  VerticalAlignProps
} from 'styled-system';
import { SetIntersection } from 'utility-types';

import Icon from './Icon';

type ToolTipIcon = SetIntersection<
  React.ComponentProps<typeof Icon>['type'],
  'questionBlack' | 'questionWhite' | 'informational' | 'warning'
>;

const Override = styled.div<SpaceProps & VerticalAlignProps & DisplayProps>`
  /** Allow caller to control spacing  */
  ${space}
  ${verticalAlign}
  ${display}
  /** Migrate Rep has an input inside a Tooltip. The input should fill the width of its container */
  span {
    width: 100%;
  }
`;

function Tooltip({
  type = 'questionBlack',
  tooltip,
  children,
  display = 'inline-flex',
  verticalAlign = 'middle',
  ...props
}: {
  tooltip: React.ReactNode;
  type?: ToolTipIcon;
  children?: React.ReactNode;
} & SpaceProps &
  VerticalAlignProps &
  DisplayProps) {
  return (
    <Override verticalAlign={verticalAlign} display={display} {...props}>
      <UITooltip tooltip={tooltip}>
        {children ? children : <Icon type={type} size="1em" />}
      </UITooltip>
    </Override>
  );
}

export default Tooltip;
