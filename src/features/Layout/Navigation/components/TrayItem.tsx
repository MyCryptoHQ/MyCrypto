import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { COLORS } from '@theme';
import { IRouteLink } from '@types';

const SLink = styled(Link)`
  width: 100%;
  margin: 8px 0;
`;

export const TrayItem = ({ item, current }: { item: IRouteLink; current: boolean }) => (
  <SLink to={item.to}>
    <Box variant="rowAlign">
      <Icon color={COLORS.BLUE_DARK_SLATE} type={item.icon} width="24px" />
      <Text ml="15px" color="BLUE_DARK_SLATE" fontWeight={current ? 'bold' : 'normal'}>
        {item.title}
      </Text>
    </Box>
  </SLink>
);
