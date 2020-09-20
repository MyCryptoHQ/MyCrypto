import React from 'react';

import Text, { TextProps } from './Text';

interface TypographyProps {
  children: React.ReactNode;
}

export const Heading = ({
  children,
  as = 'h1',
  ...props
}: TypographyProps & Omit<TextProps, 'variant'>) => (
  <Text as={as} variant="heading" {...props}>
    {children}
  </Text>
);

export const SubHeading = ({
  children,
  as = 'h2',
  ...props
}: TypographyProps & Omit<TextProps, 'variant'>) => (
  <Text as={as} variant="subHeading" {...props}>
    {children}
  </Text>
);

export const Body = ({
  children,
  as = 'p',
  ...props
}: TypographyProps & Omit<TextProps, 'variant'>) => (
  <Text as={as} variant="body" {...props}>
    {children}
  </Text>
);

export const InlineLink = ({
  children,
  as = 'a',
  ...props
}: TypographyProps & Omit<TextProps, 'variant'>) => (
  <Text as={as} variant="inlineLink" {...props}>
    {children}
  </Text>
);

export const Link = ({
  children,
  as = 'a',
  ...props
}: TypographyProps & Omit<TextProps, 'variant'>) => (
  <Text as={as} variant="link" {...props}>
    {children}
  </Text>
);
