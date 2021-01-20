import React, { ReactNode, useState } from 'react';

import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { BREAK_POINTS, COLORS } from '@theme';
import { INavTray } from '@types';
import { useEffectOnce, useTimeoutFn } from '@vendor';

import { Tray } from './Tray';

const SIcon = styled(Icon)`
  position: absolute;
  top: 2vh;
  right: 0.7vh;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

export const NavTray = ({ tray, content }: { tray: INavTray; content: ReactNode }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const [isReady, clear, set] = useTimeoutFn(() => setOpen(false), 500);

  const handleOpen = () => {
    isReady() === false && clear();
    setOpen(true);
  };

  const handleClose = () => isReady() !== false && set();

  useEffectOnce(() => clear());
  return (
    <Box
      style={{ cursor: 'pointer' }}
      variant="columnCenter"
      width="100%"
      height={{ sm: 'auto' }}
      py={{ _: '3px', sm: '1.2vh' }}
      position={{ _: undefined, sm: 'relative' }}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
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
