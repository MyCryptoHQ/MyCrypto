import React from 'react';

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
import { isVoid } from '@utils';

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
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  } & {
    textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
    $truncate?: boolean;
    $maxCharLen?: number;
    $value?: string;
  };

const SText: React.FC<TextProps> = styled.p<TextProps & { $maxCharLen: number }>`
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

  ${({ $truncate, $maxCharLen, $value }) => {
    if (!$truncate || !$value) return;
    const charLength = $value && $value.length;

    if (charLength >= $maxCharLen / 3) {
      return `
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;

          line-height: 1.4rem;
          max-height: calc(1.4rem * 3);
          width: ${$maxCharLen / 3}ch;
        `;
    }
    if (charLength >= $maxCharLen / 5) {
      return `
        @media (max-width: 850px) {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;

          line-height: 1.4rem;
          max-height: calc(1.4rem * 5);
          width: ${$maxCharLen / 5}ch;
        }
      `;
    }
  }}
`;

const Text: React.FC<TextProps & { isDiscrete?: boolean }> = ({
  isDiscrete,
  $value,
  $maxCharLen = 51,
  ...props
}) => {
  return isVoid($value) ? (
    <SText variant={isDiscrete ? 'discrete' : 'body'} $maxCharLen={$maxCharLen} {...props} />
  ) : (
    <SText variant={isDiscrete ? 'discrete' : 'body'} $maxCharLen={$maxCharLen} {...props}>
      {$value}
    </SText>
  );
};

export default Text;
