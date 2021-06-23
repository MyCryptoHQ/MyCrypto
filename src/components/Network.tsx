import { FC } from 'react';

import { scale } from '@mycrypto/ui';
import { size } from 'polished';
import styled from 'styled-components';

import Box from './Box';
import { Text } from './NewTypography';

const Color = styled.div`
  background: ${(props) => props.color};

  border-radius: 50%;
  display: inline-block;
  margin-right: 0.7ch;
  ${size(scale(-1))};
`;

export const Network: FC<{ color: string }> = ({ children, color }) => (
  <Box variant="rowAlign">
    <Color color={color} />
    <Text as="span">{children}</Text>
  </Box>
);

export default Network;
