import { ReactNode } from 'react';

import { Box } from '@components';

export const Navbar = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      position="fixed"
      zIndex={{ _: 997, sm: 999 }}
      backgroundColor="BLUE_DARK_SLATE"
      width={{ _: '100vw', sm: '6.4vh', xxl: '64px' }}
      height={{ _: '57px', sm: '100vh' }}
      bottom={{ _: 0, sm: 'auto' }}
      top={{ sm: 0 }}
    >
      <Box variant="rowAlign" flexDirection={{ sm: 'column' }} height="100%" width="100%">
        {children}
      </Box>
    </Box>
  );
};
