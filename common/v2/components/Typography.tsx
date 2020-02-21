import React from 'react';
import styled from 'styled-components';
import { Typography as UITypography } from '@mycrypto/ui';
import { IS_MOBILE } from 'v2/utils';

const TRUNCATE_CHARACTERS = IS_MOBILE ? 28 : 18;

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

type SProps = Props & { forwardedAs: string };

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

  ${(p: SProps) =>
    p.truncate &&
    ((p.children && p.children.length >= TRUNCATE_CHARACTERS) ||
      (p.value && p.value.length >= TRUNCATE_CHARACTERS)) &&
    `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: ${TRUNCATE_CHARACTERS}ch;
  `}
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
  return (
    // @ts-ignore: forwardedAs is not respected so use SC as
    // https://styled-components.com/docs/api#forwardedas-prop
    <STypography as={as} bold={bold} fontSize={fontSize} truncate={truncate} {...props}>
      {children ? children : value}
    </STypography>
  );
}

export default Typography;
