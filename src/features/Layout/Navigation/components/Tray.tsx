import { ReactNode } from 'react';

import { Box } from '@components';

export const Tray = ({ children }: { children: ReactNode }) => (
  <Box
    display="flex"
    backgroundColor={{ _: 'BG_GRAY', sm: 'WHITE' }}
    position="absolute"
    left={{ _: '0', sm: '6.5vh', xxl: '65px' }}
    bottom={{ _: '57px', sm: 'auto' }}
    flexDirection="column"
    boxShadow={{
      _: 'mobile',
      sm: 'desktop'
    }}
    borderRadius="3px"
    width={{ _: '100vw', sm: '25.5vh', xxl: '255px' }}
  >
    {children}
  </Box>
);
