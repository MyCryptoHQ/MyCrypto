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

type StyleProps = Omit<TextProps, 'textTransform'> & {
  $textTransform?: TextProps['textTransform'];
  $animate?: boolean;
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
  ${({ $animate }) =>
    $animate &&
    `&:hover {
      transform: scale(1.05);
      transition: all 300ms;
    }
    transition: all 300ms;`}
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
  ${({ $animate }) =>
    $animate &&
    `&:hover {
      transform: scale(1.05);
      transition: all 300ms;
    }
    transition: all 300ms;`}
`;

interface LinkProps {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: 'inlineLink' | 'defaultLink';
  onClick?(): void;
}

type LinkAppProps = LinkProps & Omit<RouterLinkProps, 'to'>;

const LinkApp: React.FC<LinkAppProps & StyleProps> = ({
  href,
  isExternal = false,
  variant = 'defaultLink',
  $animate = false,
  onClick,
  ...props
}) => {
  if (!isExternal && href.includes(`http`)) {
    throw new Error(
      `LinkApp: Received href prop ${href}. Set prop isExternal to use an external link.`
    );
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!onClick) return;
    event.preventDefault();
    onClick();
  };

  return isExternal ? (
    <SLink
      href={href}
      variant={variant}
      $animate={$animate}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      {...props}
    />
  ) : (
    <SRouterLink to={href} variant={variant} $animate={$animate} onClick={handleClick} {...props} />
  );
};

export default LinkApp;
