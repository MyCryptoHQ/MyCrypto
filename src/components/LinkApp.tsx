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

const SLink = styled.a<TextProps & HTMLAnchorElement>`
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
`;

const SRouterLink = styled(RouterLink)<TextProps & RouterLinkProps>`
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
`;

interface LinkProps {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: 'inlineLink' | 'defaultLink' | 'topNavLink';
  onClick?(): void;
}

type LinkAppProps = LinkProps & Omit<RouterLinkProps, 'to'>;

const LinkApp: React.FC<LinkAppProps & TextProps> = ({
  href,
  isExternal = false,
  variant = 'defaultLink',
  onClick,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!onClick) return;
    event.preventDefault();
    onClick();
  };

  return isExternal ? (
    <SLink
      href={href}
      variant={variant}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      {...props}
    />
  ) : (
    <SRouterLink to={href} variant={variant} onClick={handleClick} {...props} />
  );
};

export default LinkApp;
