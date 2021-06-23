import { INavigationProps } from '@types';

import { Navbar, NavLink, NavTray, TrayItem } from './components';
import { mobileLinks } from './constants';

const MobileNav = ({ appRoutes, current }: INavigationProps) => {
  const links = mobileLinks(appRoutes);
  return (
    <Navbar>
      {links.map((item, i) => {
        switch (item.type) {
          case 'internal':
            return <NavLink key={i} link={item} current={current === item.to} />;
          case 'tray':
            return (
              <NavTray
                tray={item}
                key={i}
                content={item.items.map(
                  (item, i) =>
                    item.type === 'internal' && (
                      <TrayItem item={item} key={i} current={current === item.to} />
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
