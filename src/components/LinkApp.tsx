import React from 'react';

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
<<<<<<< HEAD
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
  readonly variant?: 'inlineLink' | 'defaultLink';
=======

import { Text, TextProps } from '@components';

interface LinkProps {
  isExternal: boolean;
  variant?: 'inlineLink' | 'defaultLink';
  href: string;
>>>>>>> c5a320e93 (Create LinkApp)
  onClick?(): void;
}

type LinkAppProps = LinkProps & Omit<RouterLinkProps, 'to'>;

<<<<<<< HEAD
const LinkApp: React.FC<LinkAppProps & TextProps> = ({
  href,
  isExternal = false,
  variant = 'defaultLink',
  onClick,
  ...props
}) => {
=======
const LinkApp = ({
  isExternal = false,
  href,
  variant = 'defaultLink',
  children,
  onClick,
  ...props
}: LinkAppProps & TextProps & { children: React.ReactNode }) => {
>>>>>>> c5a320e93 (Create LinkApp)
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!onClick) return;
    event.preventDefault();
    onClick();
  };

<<<<<<< HEAD
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
=======
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" onClick={handleClick}>
        <Text as="span" variant={variant}>
          {children}
        </Text>
      </a>
    );
  } else {
    return (
      <RouterLink to={href} onClick={handleClick} {...props}>
        <Text as="span" variant={variant}>
          {children}
        </Text>
      </RouterLink>
    );
  }
>>>>>>> c5a320e93 (Create LinkApp)
};

export default LinkApp;
