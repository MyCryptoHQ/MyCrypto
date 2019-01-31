import React from 'react';
import classnames from 'classnames';

import { DrawerProvider } from 'v2/providers';
import './Layout.scss';

// Legacy
import { makeAutoNodeName } from 'libs/nodes';
import { Query } from 'components/renderCbs';
import NewHeader from 'components/Header/NewHeader/NewHeader';
import NewFooter from 'components/Footer/NewFooter/NewFooter';

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
            <NewHeader networkParam={network && makeAutoNodeName(network)} />
          )}
        />
        <div className={contentClassName}>{children}</div>
        <NewFooter />
      </main>
    </DrawerProvider>
  );
}
