import styled from 'styled-components';
import {
  space,
  SpaceProps,
  lineHeight,
  LineHeightProps,
  fontSize,
  FontSizeProps,
  fontStyle,
  FontStyleProps,
  size,
  SizeProps,
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  textStyle,
  TextStyleProps,
  fontFamily,
  FontFamilyProps,
  fontWeight,
  FontWeightProps,
  letterSpacing,
  LetterSpacingProps
} from 'styled-system';

import { textVariants, TextVariants } from '@theme';

export type TextProps = SpaceProps &
  LineHeightProps &
  FontSizeProps &
  FontStyleProps &
  SizeProps &
  ColorProps &
  ColorStyleProps &
  TextStyleProps &
  FontFamilyProps &
  FontWeightProps &
  LetterSpacingProps & {
    variant?: TextVariants;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  };

const Text: React.FC<TextProps> = styled.p<TextProps>`
  ${space}
  ${fontSize}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${letterSpacing}
  ${fontFamily}
  ${fontWeight}
  ${textVariants}
`;

export default Text;
