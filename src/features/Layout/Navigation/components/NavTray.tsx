import { ReactNode, useRef, useState } from 'react';

import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { BREAK_POINTS, COLORS } from '@theme';
import { INavTray } from '@types';
import { useScreenSize } from '@utils';
import { useClickAway, useEffectOnce, useTimeoutFn } from '@vendor';

import { Tray } from './Tray';

const SIcon = styled(Icon)`
  position: absolute;
  top: 2vh;
  right: 0.7vh;
  @media screen and (min-width: ${BREAK_POINTS.SCREEN_XXL}) {
    top: 20px;
    right: 7px;
  }
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

export const NavTray = ({ tray, content }: { tray: INavTray; content: ReactNode }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const { isMobile } = useScreenSize();

  const [isReady, clear, set] = useTimeoutFn(() => setOpen(false), 300);

  const handleToggle = () => {
    if (!isMobile) return;
    setOpen(!isOpen);
  };

  useClickAway(ref, () => isMobile && setOpen(false));

  const handleOpen = () => {
    if (isMobile) return;
    isReady() === false && clear();
    setOpen(true);
  };

  const handleClose = () => isReady() !== false && !isMobile && set();

  useEffectOnce(() => clear());
  return (
    <Box
      style={{ cursor: 'pointer' }}
      variant="columnCenter"
      width="100%"
      height={{ sm: 'auto' }}
      py={{ _: '3px', sm: '1.2vh', xxl: '12px' }}
      position={{ _: undefined, sm: 'relative' }}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onClick={handleToggle}
      px={{ sm: '3px' }}
      ref={ref}
    >
      <SIcon type="caret" color={COLORS.BLUE_GREY} height={{ _: '0.8vh', xxl: '8px' }} />
      <Icon type={tray.icon} height={{ _: '24px', sm: '2.4vh', xxl: '24px' }} color="WHITE" />
      <Text variant="navItem" fontSize={{ _: '10px', sm: '1.1vh', xxl: '10px' }} color="WHITE">
        {tray.title}
      </Text>
      {isOpen && <Tray>{content}</Tray>}
    </Box>
  );
};
