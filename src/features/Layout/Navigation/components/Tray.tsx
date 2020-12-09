import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Box } from '@components';

const SBox = styled(Box)`
  transition: width 600ms ease;
`;

export const Tray = ({ children }: { children: ReactNode }) => (
  <SBox
    display="flex"
    backgroundColor={{ _: 'BG_GRAY', sm: 'WHITE' }}
    position="absolute"
    left={{ _: '0', sm: '65px' }}
    bottom={{ _: '57px', sm: 'auto' }}
    flexDirection="column"
    boxShadow={{
      _: 'mobile',
      sm: 'desktop'
    }}
    borderRadius="3px"
    px="16px"
    py="8px"
    width={{ _: '100vw', sm: '250px' }}
  >
    {children}
  </SBox>
);
