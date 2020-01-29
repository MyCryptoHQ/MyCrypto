import React from 'react';
import styled from 'styled-components';
import { Typography as UITypography } from '@mycrypto/ui';

interface Props {
  as?: string;
  value?: any;
  children?: any;
  bold?: boolean;
  fontSize?: string;
  style?: any;
}

type SProps = Props & { forwardedAs: string };

const STypography = styled(UITypography)`
  line-height: 24px;
  vertical-align: middle;
  font-weight: ${(p: SProps) => (p.bold ? '600' : '400')};
  font-size: ${(p: SProps) => p.fontSize} !important;
  // UITypography component defaults to a 'p' tag with a margin-bottom.
  // To facilitate text and icon alignement we remove it here once and for all.
  margin-bottom: 0px;
`;

function Typography({ as = 'span', value, fontSize = '1rem', bold, children, ...props }: Props) {
  return (
    // @ts-ignore: forwardedAs is not respected so use SC as
    // https://styled-components.com/docs/api#forwardedas-prop
    <STypography as={as} bold={bold} fontSize={fontSize} {...props}>
      {children ? children : value}
    </STypography>
  );
}

export default Typography;
