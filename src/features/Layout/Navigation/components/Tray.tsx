import React, { ReactNode } from 'react';

import { Box } from '@components';

export const Tray = ({ children }: { children: ReactNode }) => (
  <Box
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
    width={{ _: '100vw', sm: '250px' }}
  >
    {children}
  </Box>
);
