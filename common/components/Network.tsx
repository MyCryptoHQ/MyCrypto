import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { size } from 'polished';

import { scale } from '@mycrypto/ui';
import { default as Typography } from './Typography';

const Color = styled.div`
  background: ${props => props.color};

  border-radius: 50%;
  display: inline-block;
  margin-right: ${scale(-1)};
  ${size(scale(-1))};
`;

export function Network({ children, color }: { children: ReactNode; color: string }) {
  return (
    <>
      <Color color={color} />
      <Typography as="span">{children}</Typography>
    </>
  );
}

export default Network;
