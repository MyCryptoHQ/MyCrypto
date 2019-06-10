import React from 'react';
import styled from 'styled-components';
import { Typography as UITypography } from '@mycrypto/ui';

interface Props {
  as?: string;
  value?: any;
  children?: any;
  bold?: boolean;
  small?: boolean;
  style?: any;
}

const STypography = styled(UITypography)`
  font-weight: ${(p: Props) => (p.bold ? '600' : '400')};
  font-size: ${(p: Props) => (p.small ? '0.8em' : 'inherit')};
`;

function Typography({ as = 'span', value, small, bold, children, ...props }: Props) {
  return (
    <STypography as={as} bold={bold} small={small} {...props}>
      {children ? children : value}
    </STypography>
  );
}

export default Typography;
