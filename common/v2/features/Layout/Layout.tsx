import React from 'react';
import classnames from 'classnames';

import { DrawerProvider } from 'v2/providers';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

// Legacy
import { makeAutoNodeName } from 'libs/nodes';
import { Query } from 'components/renderCbs';

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
        <Query
          params={['network']}
          withQuery={({ network }) => (
            <Header networkParam={network && makeAutoNodeName(network)} />
          )}
        />
        <div className={contentClassName}>{children}</div>
        <Footer />
      </main>
    </DrawerProvider>
  );
}
