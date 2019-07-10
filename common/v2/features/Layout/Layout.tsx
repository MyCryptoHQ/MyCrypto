import React, { useContext } from 'react';
import classnames from 'classnames';

import { DrawerProvider, DrawerContext } from 'v2/providers';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

interface Props {
  className?: string;
  centered?: boolean;
  fluid?: boolean;
  children?: any;
}

export default function Layout({ centered = true, fluid, className = '', children }: Props) {
  const contentClassName = classnames('Layout-content', {
    centered,
    fluid
  });

  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);

  return (
    <DrawerProvider>
      <main className={`Layout ${className}`}>
        <Header
          drawerVisible={visible}
          toggleDrawerVisible={toggleVisible}
          setDrawerScreen={setScreen}
        />
        <div className={contentClassName}>{children}</div>
        <Footer />
      </main>
    </DrawerProvider>
  );
}
