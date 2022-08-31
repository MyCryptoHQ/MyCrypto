import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { INavigationProps } from '@types';

import { Navbar, NavLink, NavTray, SupportUsTray, TrayItem } from './components';
import { desktopLinks, settingsLinks, supportUsTray, toolsTray } from './constants';

interface IDesktopNav extends INavigationProps {
  openTray(): void;
}

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

const DesktopNav = ({ appRoutes, current, openTray }: IDesktopNav) => {
  const links = desktopLinks(appRoutes);
  const tools = toolsTray(appRoutes);
  const settings = settingsLinks(appRoutes);
  return (
    <Navbar>
      <Box my={{ sm: '1.6vh', xxl: '16px' }} ml="3px">
        <Icon type="logo-mycrypto" width={{ sm: '4vh', xxl: '40px' }} />
      </Box>
      {links.map((link, i) => (
        <NavLink key={i} link={link} current={current === link.to} />
      ))}
      <Box
        variant="columnAlign"
        borderY={`1px solid ${COLORS.GREY_DARK}`}
        width="100%"
        py={{ sm: '2vh', xxl: '20px' }}
        flex={1}
      >
        <NavTray
          tray={tools}
          content={tools.items.map(
            (item, i) =>
              item.type === 'internal' && (
                <TrayItem item={item} key={i} current={current === item.to} />
              )
          )}
        />
        <NavTray tray={supportUsTray} content={<SupportUsTray items={supportUsTray.items} />} />
      </Box>
      <NavLink link={settings} current={current === settings.to} />
      <SBox variant="columnCenter" width="100%" px="3px" py="12px" onClick={openTray}>
        <Icon type="nav-menu" height={{ sm: '2.4vh', xxl: '24px' }} color={COLORS.WHITE} />
        <Text variant="navItem" fontSize={{ sm: '1.1vh', xxl: '10px' }} color="WHITE">
          {translateRaw('NAVIGATION_MENU')}
        </Text>
      </SBox>
    </Navbar>
  );
};

export default DesktopNav;
