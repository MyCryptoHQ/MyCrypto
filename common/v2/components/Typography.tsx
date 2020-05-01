import React from 'react';
import styled from 'styled-components';
import { Typography as UITypography } from '@mycrypto/ui';

import { useScreenSize } from 'v2/utils';
import { BREAK_POINTS } from 'v2/theme';

interface Props {
  as?: string;
  value?: any;
  children?: any;
  bold?: boolean;
  fontSize?: string;
  style?: any;
  truncate?: boolean;
  inheritFontWeight?: boolean;
  onClick?(): void;
}

type SProps = Props & { forwardedAs: string; maxCharLen: number };

const STypography = styled(UITypography)`
  line-height: 24px;
  vertical-align: middle;
  ${(p: SProps) => !p.inheritFontWeight && `font-weight: ${p.bold ? '600' : '400'};`}
  font-size: ${(p: SProps) => p.fontSize} !important;
  /*
    UITypography component defaults to a 'p' tag with a margin-bottom.
    To facilitate text and icon alignement we remove it here once and for all.
  */
  margin-bottom: 0px;

  ${({ truncate, maxCharLen, children, value }) => {
    const childrenLength = children && children.length;
    const valueLength = value && value.length;
    const charLength = childrenLength || valueLength;

    const styles: string[] = [];
    if (truncate && charLength >= maxCharLen / 3) {
      styles.push(`
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;

          line-height: 1.4rem;
          max-height: calc(1.4rem * 3);
          width: ${maxCharLen / 3}ch;
        `);
    }
    if (truncate && charLength >= maxCharLen / 5) {
      styles.push(`
        @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;

          line-height: 1.4rem;
          max-height: calc(1.4rem * 5);
          width: ${maxCharLen / 5}ch;
        }
      `);
    }
    return styles.join('');
  }}
`;

function Typography({
  as = 'span',
  value,
  fontSize = '1rem',
  bold,
  children,
  truncate,
  ...props
}: Props) {
  const { isMobile } = useScreenSize();
  const maxCharLen = isMobile ? 58 : 75;

  return (
    <STypography
      // ForwardedAs is not respected so use SC as
      // https://styled-components.com/docs/api#forwardedas-prop
      // @ts-ignore
      as={as}
      bold={bold}
      fontSize={fontSize}
      truncate={truncate}
      maxCharLen={maxCharLen}
      {...props}
    >
      {children ? children : value}
    </STypography>
  );
}

export default Typography;
