import styled from 'styled-components';
import {
  color,
  ColorProps,
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps
} from 'styled-system';

import { flexVariants, FlexVariants } from '@theme';

type Props = SpaceProps &
  LayoutProps &
  ColorProps &
  FlexboxProps &
  PositionProps &
  DisplayProps & { variant?: FlexVariants };

const Box = styled.div<Props>(
  {
    boxSizing: 'border-box',
    minWidth: 0
  },
  position,
  space,
  color,
  layout,
  flexbox,
  flexVariants,
  display
);

export default Box;
