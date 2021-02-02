import React from 'react';

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import { Text, TextProps } from '@components';

interface LinkProps {
  isExternal: boolean;
  variant?: 'inlineLink' | 'defaultLink';
  href: string;
  onClick?(): void;
}

type LinkAppProps = LinkProps & Omit<RouterLinkProps, 'to'>;

const LinkApp = ({
  isExternal = false,
  href,
  variant = 'defaultLink',
  children,
  onClick,
  ...props
}: LinkAppProps & TextProps & { children: React.ReactNode }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!onClick) return;
    event.preventDefault();
    onClick();
  };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" onClick={handleClick}>
        <Text as="span" variant={variant} {...props}>
          {children}
        </Text>
      </a>
    );
  } else {
    return (
      <RouterLink to={href} onClick={handleClick}>
        <Text as="span" {...props}>
          {children}
        </Text>
      </RouterLink>
    );
  }
};

export default LinkApp;
