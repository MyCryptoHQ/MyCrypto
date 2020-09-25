import styled from 'styled-components';
import {
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  space,
  SpaceProps
} from 'styled-system';

type Props = SpaceProps & LayoutProps & ColorProps & FlexboxProps;

const Box = styled.div<Props>(
  {
    boxSizing: 'border-box',
    minWidth: 0
  },
  space,
  color,
  layout,
  flexbox
);

export default Box;
