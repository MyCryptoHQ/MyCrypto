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
