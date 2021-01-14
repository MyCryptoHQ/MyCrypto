import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { COLORS } from '@theme';
import { IRouteLink } from '@types';

const SLink = styled(Link)`
  &:hover {
    background-color: ${COLORS.BLUE_DARK_SLATE};
    p {
      color: ${COLORS.WHITE};
      transition: all 300ms;
    }
    path {
      fill: ${COLORS.WHITE};
      transition: all 300ms;
    }
    opacity: 1;
    transition: all 300ms;
  }
  transition: all 300ms;
`;

export const TrayItem = ({ item, current }: { item: IRouteLink; current: boolean }) => (
  <SLink style={{ width: '100%', padding: '10px 15px', margin: 0 }} to={item.to}>
    <Box variant="rowAlign">
      <Icon color={COLORS.BLUE_DARK_SLATE} type={item.icon} width="24px" />
      <Text ml="15px" color="BLUE_DARK_SLATE" fontWeight={current ? 'bold' : 'normal'} mb={0}>
        {item.title}
      </Text>
    </Box>
  </SLink>
);
