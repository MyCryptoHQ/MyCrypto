import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { ROUTE_PATHS } from '@config';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';

import { LinkSet, Subscribe } from './components';

const SIcon = styled(Icon)`
  &:hover {
    transform: rotate(90deg);
  }
  transition: all 300ms ease;
`;

export const ExtrasTray = ({ isMobile, closeTray }: { isMobile: boolean; closeTray(): void }) => {
  return (
    <Box
      zIndex={999}
      display="flex"
      flexDirection="column"
      backgroundColor="BG_GRAY"
      borderRadius="default"
      position="fixed"
      width={{ _: '100vw', sm: '375px' }}
      bottom={0}
      left={{ _: 0, sm: '65px' }}
      height={{ _: '100vh', sm: 'auto' }}
      boxShadow={{ sm: '3px 3px 20px rgba(0, 0, 0, 0.15);' }}
      overflowY={{ _: 'scroll', sm: 'auto' }}
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
            <SIcon
              type="nav-close"
              width="16px"
              style={{ cursor: 'pointer' }}
              onClick={closeTray}
            />
          </Box>
        )}
        <Subscribe />
      </Box>
      <LinkSet isMobile={isMobile} />
      <Link to={ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path} style={{ width: '100%' }}>
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
      </Link>
    </Box>
  );
};
