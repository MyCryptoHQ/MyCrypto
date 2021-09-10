import styled from 'styled-components';

import { Box, Icon, LinkApp, Text } from '@components';
import { BREAK_POINTS, COLORS } from '@theme';
import { IRouteLink } from '@types';

const SLink = styled(LinkApp)`
  &:hover {
    opacity: 1;
  }
  width: 100%;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    height: 100%;
  }
`;

const SBox = styled(Box)`
  transition: all 300ms;

  &:hover {
    cursor: pointer;
    background-color: ${COLORS.BG_GRAY};
    transition: all 300ms;
    color: ${COLORS.GREYISH_BROWN};
    svg {
      color: ${COLORS.GREYISH_BROWN};
    }
  }
`;

export const NavLink = ({ link, current }: { link: IRouteLink; current: boolean }) => (
  <SLink href={link.to} variant="barren">
    <SBox
      variant="columnCenter"
      backgroundColor={current ? 'BG_GRAY' : 'transparent'}
      borderLeft={{ sm: `3px solid ${current ? COLORS.BLUE_SKY : 'transparent'}` }}
      borderBottom={{
        _: `3px solid ${current ? COLORS.BLUE_SKY : 'transparent'}`,
        sm: 'none'
      }}
      width="100%"
      height="100%"
      pr={{ sm: '3px' }}
      py={{ _: '0', sm: '1.2vh', xxl: '12px' }}
      pt={{ _: '3px', sm: '1.2vh', xxl: '12px' }}
      color={current ? COLORS.GREYISH_BROWN : COLORS.WHITE}
    >
      <Icon
        type={link.icon}
        height={{ _: '24px', sm: '2.4vh', xxl: '24px' }}
        color={current ? COLORS.GREYISH_BROWN : COLORS.WHITE}
      />
      <Text variant="navItem" fontSize={{ _: '10px', sm: '1.1vh', xxl: '10px' }}>
        {link.title}
      </Text>
    </SBox>
  </SLink>
);
