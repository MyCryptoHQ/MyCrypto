import React, { ReactNode, useState } from 'react';

import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { BREAK_POINTS, COLORS } from '@theme';
import { INavTray } from '@types';

import { Tray } from './Tray';

const SIcon = styled(Icon)`
  position: absolute;
  top: 20px;
  right: 5px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

export const NavTray = ({ tray, content }: { tray: INavTray; content: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleHover = () => setIsOpen(!isOpen);
  return (
    <Box
      style={{ cursor: 'pointer' }}
      variant="columnCenter"
      width="100%"
      height={{ sm: 'auto' }}
      py={{ _: '3px', sm: '1.2vh' }}
      position={{ _: undefined, sm: 'relative' }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      <SIcon type="caret" color={COLORS.BLUE_GREY} height="0.8vh" />
      <Icon type={tray.icon} height="2.5vh" color="WHITE" />
      <Text variant="navItem" color="WHITE">
        {tray.title}
      </Text>
      {isOpen && <Tray>{content}</Tray>}
    </Box>
  );
};
