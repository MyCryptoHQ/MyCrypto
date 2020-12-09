import React from 'react';

import { useLocation } from 'react-router-dom';

import { getAppRoutesObject } from '@routing';
import { useFeatureFlags } from '@services';

import { Navbar, NavLink, NavTray, TrayItem } from './components';
import { mobileLinks } from './constants';

const MobileNav = () => {
  const { pathname } = useLocation();
  const { featureFlags } = useFeatureFlags();
  const APP_ROUTES = getAppRoutesObject(featureFlags);

  const links = mobileLinks(APP_ROUTES);
  return (
    <Navbar>
      {links.map((item, i) => {
        switch (item.type) {
          case 'internal':
            return <NavLink key={i} link={item} actual={pathname === item.to} />;
          case 'tray':
            return (
              <NavTray
                tray={item}
                content={item.items.map(
                  (item, i) =>
                    item.type === 'internal' && (
                      <TrayItem item={item} key={i} actual={pathname === item.to} />
                    )
                )}
              />
            );
        }
      })}
    </Navbar>
  );
};

export default MobileNav;
