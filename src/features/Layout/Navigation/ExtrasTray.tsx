import { useRef } from 'react';

import { Box, Icon, LinkApp, Text } from '@components';
import { ROUTE_PATHS } from '@config';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { useClickAway } from '@vendor';

import { LinkSet, Subscribe } from './components';

export const ExtrasTray = ({ isMobile, closeTray }: { isMobile: boolean; closeTray(): void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => !isMobile && closeTray());

  return (
    <Box
      zIndex={998}
      display="flex"
      flexDirection="column"
      backgroundColor="BG_GRAY"
      borderRadius="default"
      position={{ _: 'absolute', sm: 'fixed' }}
      width={{ _: '100vw', sm: '375px' }}
      top={{ _: 0, sm: 'unset' }}
      bottom={{ sm: 0 }}
      left={{ _: 0, sm: '6.8vh', xxl: '67px' }}
      height={{ sm: 'auto' }}
      boxShadow={{ sm: '3px 3px 20px rgba(0, 0, 0, 0.15);' }}
      ref={ref}
    >
      <Box
        backgroundColor="BLUE_DARK_SLATE"
        px={SPACING.SM}
        py={SPACING.BASE}
        pt={{ _: '90px', sm: SPACING.BASE }}
        borderTopLeftRadius="default"
        borderTopRightRadius="default"
      >
        {!isMobile && (
          <Box variant="rowAlign" justifyContent="space-between" mb={SPACING.BASE}>
            <Text fontSize={3} color="WHITE" fontWeight={700} mb={0}>
              {translateRaw('NAVIGATION_EXTRAS')}
            </Text>
            <Icon type="nav-close" color="WHITE" width="16px" mr="15px" onClick={closeTray} />
          </Box>
        )}
        <Subscribe />
      </Box>
      <LinkSet isMobile={isMobile} />
      <LinkApp href={ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path}>
        <Box backgroundColor="BLUE_DARK_SLATE" variant="rowCenter" py={SPACING.BASE}>
          <Text
            fontSize="14px"
            mb={0}
            mr={SPACING.SM}
            fontWeight={400}
            textTransform="uppercase"
            color="WHITE"
          >
            {translateRaw('NAVIGATION_DOWNLOAD_APPS')}
          </Text>
          <Icon type="nav-desktop" width="20px" />
        </Box>
      </LinkApp>
    </Box>
  );
};
