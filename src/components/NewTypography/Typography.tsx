import { ReactNode } from 'react';

import Text, { TextProps } from './Text';

interface TypographyProps {
  children: ReactNode;
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

export const Label = ({
  children,
  htmlFor,
  ...props
}: TypographyProps & Omit<TextProps, 'variant'> & { htmlFor?: string }) => (
  <label htmlFor={htmlFor}>
    <Body as={'span'} fontWeight="normal" {...props}>
      {children}
    </Body>
  </label>
);
