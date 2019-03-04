import React from 'react';
import classnames from 'classnames';

import { DevTools } from 'v2/features';
import { AccountProvider, DrawerProvider, DrawerContext } from 'v2/providers';
import { isDevelopment } from 'v2/utils';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

interface Props {
  className?: string;
  centered?: boolean;
  fluid?: boolean;
  children: any;
}

export default function Layout({ centered, fluid, className = '', children }: Props) {
  const contentClassName = classnames('Layout-content', {
    centered,
    fluid
  });

  return (
    <AccountProvider>
      <DrawerProvider>
        <main className={`Layout ${className}`}>
          <DrawerContext.Consumer>
            {({ visible, toggleVisible, setScreen }) => (
              <Header
                drawerVisible={visible}
                toggleDrawerVisible={toggleVisible}
                setDrawerScreen={setScreen}
              />
            )}
          </DrawerContext.Consumer>
          <div className={contentClassName}>{children}</div>
          <Footer />
        </main>
        {isDevelopment() && <DevTools />}
      </DrawerProvider>
    </AccountProvider>
  );
}
