import React from 'react';

import { Box, Icon } from '@components';
import { COLORS } from '@theme';
import { INavigationProps } from '@types';

import { Navbar, NavLink, NavTray, SupportUsTray, TrayItem } from './components';
import { desktopLinks, settingsLinks, supportUsTray, toolsTray } from './constants';

const DesktopNav = ({ appRoutes, current }: INavigationProps) => {
  const links = desktopLinks(appRoutes);
  const tools = toolsTray(appRoutes);
  const settings = settingsLinks(appRoutes);
  return (
    <Navbar>
      <Box my="16px">
        <Icon type="logo-mycrypto" width="38px" />
      </Box>
      {links.map((link, i) => (
        <NavLink key={i} link={link} current={current === link.to} />
      ))}
      <Box
        variant="columnAlign"
        borderY={`1px solid ${COLORS.GREY_DARK}`}
        width="100%"
        my="20px"
        py="20px"
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
    </Navbar>
  );
};

export default DesktopNav;
