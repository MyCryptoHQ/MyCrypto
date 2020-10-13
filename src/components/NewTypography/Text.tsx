import styled from 'styled-components';
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontStyle,
  FontStyleProps,
  lineHeight,
  LineHeightProps,
  size,
  SizeProps,
  space,
  SpaceProps,
  textStyle,
  TextStyleProps,
  typography,
  TypographyProps
} from 'styled-system';

import { textVariants, TextVariants } from '@theme';

export type TextProps = SpaceProps &
  LineHeightProps &
  FontStyleProps &
  SizeProps &
  ColorProps &
  ColorStyleProps &
  TextStyleProps &
  TypographyProps & {
    variant?: TextVariants;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  } & {
    capitalize?: boolean;
  };

const Text: React.FC<TextProps> = styled.p<TextProps>`
  ${textVariants}
  ${space}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${typography}
  ${({ capitalize }) => capitalize && { 'text-transform': 'capitalize' }}
`;

export default Text;
