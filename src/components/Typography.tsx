import { ComponentType, CSSProperties, FC, MouseEvent, ReactElement } from 'react';

import { Typography as UITypography } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from '@theme';
import { useScreenSize } from '@utils';

export interface Props {
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  value?: string | ReactElement;
  bold?: boolean;
  fontSize?: string;
  truncate?: boolean;
  inheritFontWeight?: boolean;
  style?: CSSProperties;
  onClick?(e: MouseEvent): void;
}

interface SProps {
  $maxCharLen: number;
  $bold: boolean;
  $fontSize: string;
  $truncate: boolean;
  $inheritFontWeight: boolean;
  $value: string;
}

const STypography = styled(UITypography)`
  line-height: 24px;
  vertical-align: middle;
  ${(p: SProps) => !p.$inheritFontWeight && `font-weight: ${p.$bold ? '600' : '400'};`}
  font-size: ${(p) => p.$fontSize} !important;
  /*
    UITypography component defaults to a 'p' tag with a margin-bottom.
    To facilitate text and icon alignement we remove it here once and for all.
  */
  margin-bottom: 0px;

  ${({ $truncate: truncate, $maxCharLen: maxCharLen, $value: value }: SProps) => {
    if (!truncate || !value) return;
    const charLength = value && value.length;

    const styles: string[] = [];
    if (charLength >= maxCharLen / 3) {
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
    if (charLength >= maxCharLen / 5) {
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

const Typography: FC<Props> = ({
  as = 'span',
  fontSize = '1rem',
  value,
  bold,
  truncate,
  children,
  inheritFontWeight,
  ...props
}) => {
  const { isMobile } = useScreenSize();
  const maxCharLen = isMobile ? 58 : 75;

  return (
    <STypography
      as={as}
      $bold={bold}
      $fontSize={fontSize}
      $maxCharLen={maxCharLen}
      $truncate={truncate}
      $inheritFontWeight={inheritFontWeight}
      $value={value}
      {...props}
    >
      {children ? children : value}
    </STypography>
  );
};

export default Typography;
