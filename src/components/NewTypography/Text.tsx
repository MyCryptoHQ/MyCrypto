import { ComponentType, FC } from 'react';

import styled from 'styled-components';
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontStyle,
  FontStyleProps,
  layout,
  LayoutProps,
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
  LayoutProps &
  TypographyProps & {
    variant?: TextVariants;
    as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  } & {
    textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
    textOverflow?: 'clip' | 'ellipsis' | 'string' | 'initial' | 'inherit';
    whiteSpace?:
      | 'normal'
      | 'nowrap'
      | 'pre'
      | 'pre-wrap'
      | 'pre-line'
      | 'break-spaces'
      | 'inherit'
      | 'initial'
      | 'revert'
      | 'unset';
  };

const SText: FC<TextProps> = styled.p<TextProps>`
  ${textVariants}
  ${space}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${typography}
  ${layout}
  ${({ textTransform }) => textTransform && { 'text-transform': textTransform }}
  ${({ textOverflow }) => textOverflow && { 'text-overflow': textOverflow }}
  ${({ whiteSpace }) => whiteSpace && { 'white-space': whiteSpace }}
`;

const Text: FC<TextProps & { isDiscrete?: boolean; isBold?: boolean }> = ({
  isDiscrete,
  isBold = false,
  ...props
}) => {
  return (
    <SText
      variant={isDiscrete ? 'discrete' : 'body'}
      fontWeight={isBold ? 'bold' : null}
      {...props}
    />
  );
};

export default Text;
