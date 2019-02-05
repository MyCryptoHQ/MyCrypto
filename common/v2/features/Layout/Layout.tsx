import React from 'react';
import classnames from 'classnames';

import { DrawerProvider, DrawerContext } from 'v2/providers';
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
    </DrawerProvider>
  );
}
