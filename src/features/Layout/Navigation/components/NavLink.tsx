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
  p {
    transition: all 300ms;
  }
  &:hover {
    background-color: ${COLORS.BG_GRAY};
    transition: all 300ms;
    svg {
      fill: ${COLORS.GREYISH_BROWN};
    }
    p {
      color: ${COLORS.GREYISH_BROWN};
      transition: all 300ms;
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
      py={{ _: '0', sm: '1.2vh', xxl: '12px' }}
      pt={{ _: '3px', sm: '1.2vh', xxl: '12px' }}
    >
      <Icon
        type={link.icon}
        height={{ _: '24px', sm: '2.4vh', xxl: '24px' }}
        color={current ? COLORS.GREYISH_BROWN : COLORS.WHITE}
      />

      <Text
        variant="navItem"
        fontSize={{ _: '10px', sm: '1.1vh', xxl: '10px' }}
        color={current ? 'GREYISH_BROWN' : 'WHITE'}
      >
        {link.title}
      </Text>
    </SBox>
  </SLink>
);
