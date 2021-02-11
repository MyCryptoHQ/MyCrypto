import React from 'react';

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
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
  TypographyProps,
  variant
} from 'styled-system';

import { isUrl } from '@utils/isUrl';

type LinkStyleProps = SpaceProps &
  LineHeightProps &
  FontStyleProps &
  SizeProps &
  ColorProps &
  ColorStyleProps &
  TextStyleProps &
  LayoutProps &
  TypographyProps & {
    variant?: keyof typeof LINK_VARIANTS;
    $underline?: boolean;
    $textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
  };

const LINK_RECIPES = {
  default: {
    cursor: 'pointer',
    transition: 'all 120ms ease',
    textDecoration: 'none',
    // https://mayashavin.com/articles/svg-icons-currentcolor
    svg: {
      fill: 'currentColor'
    },
    '&:hover svg': {
      fill: 'currentColor'
    }
  }
};

const LINK_VARIANTS = {
  barren: {
    ...LINK_RECIPES.default,
    color: 'inherit'
  },
  underlineLink: {
    ...LINK_RECIPES.default,
    color: 'inherit',
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  opacityLink: {
    ...LINK_RECIPES.default,
    color: 'BLUE_SKY',
    '&:hover': {
      opacity: '0.8'
    },
    '&:hover svg': {
      opacity: '0.8'
    }
  },
  defaultLink: {
    ...LINK_RECIPES.default,
    fontSize: { _: 0, sm: 1 },
    lineHeight: { _: 0, sm: 1 },
    color: 'BLUE_BRIGHT',
    '&:hover': {
      color: 'BLUE_LIGHT_DARKISH'
    },
    '&:active': {
      opacity: 1
    },
    '&:focus': {
      opacity: 1
    }
  }
};

const SLink = styled('a')<LinkStyleProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>`
  /** Overide @mycrypto/ui global styles */
  &&& {
    ${variant({
      variants: LINK_VARIANTS
    })}
  }

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
  ${({ $underline }) => $underline && { 'text-decoration': 'underline' }};
`;

const SRouterLink = styled(RouterLink)<LinkStyleProps & RouterLinkProps>`
  /** Overide @mycrypto/ui global styles */
  &&& {
    ${variant({
      variants: LINK_VARIANTS
    })}
  }

  ${space}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${typography}
  ${layout}
  ${({ $underline }) => $underline && { 'text-decoration': 'underline' }}
  ${({ $textTransform }) => $textTransform && { 'text-transform': $textTransform }}
`;

interface LinkProps {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: keyof typeof LINK_VARIANTS;
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void | undefined;
}

type Props = LinkProps &
  (React.ComponentProps<typeof SLink> | React.ComponentProps<typeof SRouterLink>);

const LinkApp: React.FC<Props> = ({
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
