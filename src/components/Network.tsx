import { FC } from 'react';

import { Box, BoxProps } from '@mycrypto/ui';
import { scale } from '@mycrypto/ui-legacy';
import { size } from 'polished';
import styled from 'styled-components';

import { Text } from './NewTypography';

const Color = styled.div`
  background: ${(props) => props.color};

  border-radius: 50%;
  display: inline-block;
  margin-right: 0.7ch;
  ${size(scale(-1))};
`;

export const Network: FC<{ color: string } & Omit<BoxProps, 'css'>> = ({
  children,
  color,
  ...props
}) => (
  <Box variant="rowAlign" {...props}>
    <Color color={color} />
    <Text as="span">{children}</Text>
  </Box>
);

export default Network;
