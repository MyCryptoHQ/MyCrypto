import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { BREAK_POINTS, COLORS } from '@theme';
import { IRouteLink } from '@types';

const SLink = styled(Link)`
  &:hover {
    opacity: 1;
  }
  width: 100%;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    height: 100%;
  }
`;

const SBox = styled(Box)`
  & * {
    transition: all 300ms;
  }
  &:hover {
    background-color: ${COLORS.BG_GRAY};
    * {
      color: ${COLORS.GREYISH_BROWN};
      fill: ${COLORS.GREYISH_BROWN};
    }
  }
  transition: all 300ms;
`;

export const NavLink = ({ link, current }: { link: IRouteLink; current: boolean }) => (
  <SLink to={link.to}>
    <SBox
      variant="columnCenter"
      backgroundColor={current ? 'BG_GRAY' : 'transparent'}
      borderLeft={{ sm: `3px solid ${current ? COLORS.BLUE_SKY : 'transparent'}` }}
      borderBottom={{ _: `3px solid ${current ? COLORS.BLUE_SKY : 'transparent'}`, sm: 'none' }}
      width="100%"
      height="100%"
      pr={{ sm: '3px' }}
      py={{ _: '0', sm: '12px' }}
      pt={{ _: '3px', sm: '12px' }}
    >
      <Icon type={link.icon} height="24px" color={current ? COLORS.GREYISH_BROWN : COLORS.WHITE} />

      <Text variant="navItem" color={current ? 'GREYISH_BROWN' : 'WHITE'}>
        {link.title}
      </Text>
    </SBox>
  </SLink>
);
