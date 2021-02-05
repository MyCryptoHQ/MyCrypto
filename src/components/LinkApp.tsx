import React from 'react';

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import styled from 'styled-components';
import {
  color,
  colorStyle,
  fontStyle,
  layout,
  lineHeight,
  size,
  space,
  textStyle,
  typography
} from 'styled-system';

import { TextProps } from '@components';
import { textVariants } from '@theme';
import { isUrl } from '@utils';

type StyleProps = Omit<TextProps, 'textTransform'> & {
  $textTransform?: TextProps['textTransform'];
};

const SLink = styled.a<StyleProps & HTMLAnchorElement>`
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
  ${({ $textTransform }) => $textTransform && { 'text-transform': $textTransform }}
`;

const SRouterLink = styled(RouterLink)<StyleProps & RouterLinkProps>`
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
  ${({ $textTransform }) => $textTransform && { 'text-transform': $textTransform }}
`;

interface LinkProps {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: 'inlineLink' | 'defaultLink' | 'noStyleLink';
  onClick?(): void;
}

type LinkAppProps = LinkProps & Omit<RouterLinkProps, 'to'>;

const LinkApp: React.FC<LinkAppProps & StyleProps> = ({
  href,
  isExternal = false,
  variant = 'defaultLink',
  onClick,
  ...props
}) => {
  if (!isExternal && isUrl(href)) {
    throw new Error(
      `LinkApp: Received href prop ${href}. Set prop isExternal to use an external link.`
    );
  }

  return isExternal ? (
    <SLink
      href={href}
      variant={variant}
      target="_blank"
      onClick={onClick}
      {...props}
      // @SECURITY set last to avoid override
      rel="noreferrer"
    />
  ) : (
    <SRouterLink to={href} variant={variant} onClick={onClick} {...props} />
  );
};

export default LinkApp;
