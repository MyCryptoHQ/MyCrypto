import styled from 'styled-components';
import {
  border,
  BorderProps,
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
  shadow,
  ShadowProps,
  space,
  SpaceProps
} from 'styled-system';

import { flexVariants, FlexVariants } from '@theme';

type Props = SpaceProps &
  LayoutProps &
  ColorProps &
  FlexboxProps &
  PositionProps &
  DisplayProps &
  ShadowProps &
  BorderProps & { variant?: FlexVariants };

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
  display,
  border,
  shadow
);

export default Box;
