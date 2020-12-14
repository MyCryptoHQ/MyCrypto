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
      py={{ _: '3px', sm: '12px' }}
      position={{ _: undefined, sm: 'relative' }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      <SIcon type="caret" color={COLORS.BLUE_GREY} height="9px" />
      <Icon type={tray.icon} height="24px" color="WHITE" />
      <Text
        textTransform="uppercase"
        fontSize="10px"
        fontWeight={700}
        margin={0}
        mt="5px"
        color="WHITE"
        px="5px"
        textAlign="center"
      >
        {tray.title}
      </Text>
      {isOpen && <Tray>{content}</Tray>}
    </Box>
  );
};
