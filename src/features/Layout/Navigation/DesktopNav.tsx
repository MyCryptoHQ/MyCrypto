import React from 'react';

import { useLocation } from 'react-router-dom';

import { Box, Icon } from '@components';
import { getAppRoutesObject } from '@routing';
import { useFeatureFlags } from '@services';
import { COLORS } from '@theme';

import { Navbar, NavLink, NavTray, SupportUsTray, TrayItem } from './components';
import { desktopLinks, settingsLinks, supportUsTray, toolsTray } from './constants';

const DesktopNav = () => {
  const { pathname } = useLocation();
  const { featureFlags } = useFeatureFlags();

  const APP_ROUTES = getAppRoutesObject(featureFlags);

  const links = desktopLinks(APP_ROUTES);
  const tools = toolsTray(APP_ROUTES);
  const settings = settingsLinks(APP_ROUTES);
  return (
    <Navbar>
      <Box my="16px">
        <Icon type="logo-mycrypto" width="38px" />
      </Box>
      {links.map((link, i) => (
        <NavLink key={i} link={link} actual={pathname === link.to} />
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
                <TrayItem item={item} key={i} actual={pathname === item.to} />
              )
          )}
        />
        <NavTray tray={supportUsTray} content={<SupportUsTray items={supportUsTray.items} />} />
      </Box>
      <NavLink link={settings} actual={pathname === settings.to} />
    </Navbar>
  );
};

export default DesktopNav;
